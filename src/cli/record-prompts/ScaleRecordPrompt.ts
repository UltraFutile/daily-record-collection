import { getRepository } from "typeorm";
import { Choice } from "../../entity/Choice";
import { ScaleRecord } from "../../entity/records/ScaleRecord";
import { AbstractRecordPrompt } from './AbstractRecordPrompt';
import { PromptOptions } from "./PromptOptions";

export class ScaleRecordPrompt extends AbstractRecordPrompt {
    protected async getPromptOptionsAsync(): Promise<PromptOptions> {
        return {
            type: 'list',
            choices: (await this.metric.choices).map(x => x.name)
        }
    }

    override async insertRecordAsync(value: string): Promise<void> {
        let choice: Choice = (await this.metric.choices).find(x => x.name === value);
        let scaleRecord = new ScaleRecord();
        scaleRecord.choice = choice; // TODO: inconsistent name? Other records use 'value'...
        scaleRecord.metric = this.metric;
        await getRepository(ScaleRecord).save(scaleRecord);
    }
}

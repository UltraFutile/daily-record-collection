import { getRepository } from "typeorm";
import { TextRecord } from "../../entity/records/TextRecord";
import { AbstractRecordPrompt } from "./AbstractRecordPrompt";
import { PromptOptions } from "./PromptOptions";

export class TextRecordPrompt extends AbstractRecordPrompt {
    protected getPromptOptionsAsync(): Promise<PromptOptions> {
        return new Promise<PromptOptions>((resolve, reject) => {
            resolve({ type: 'input'})
        })
    }

    override async insertRecordAsync(value: string) {
        let textRecord = new TextRecord();
        textRecord.value = value; // TODO: Validation for string input
        textRecord.metric = this.metric;
        await getRepository(TextRecord).save(textRecord);
    }
}

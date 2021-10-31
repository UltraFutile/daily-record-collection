import { getRepository } from "typeorm";
import { IntegerRecord } from "../../entity/records/IntegerRecord";
import { AbstractRecordPrompt } from './AbstractRecordPrompt';
import { PromptOptions } from "./PromptOptions";

export class IntegerRecordPrompt extends AbstractRecordPrompt {
    protected getPromptOptionsAsync(): Promise<PromptOptions> {
        return new Promise<PromptOptions>((resolve, reject) => {
            resolve({ 
                type: 'input',
                validate: function (answer) {
                    if (isNaN(answer)) { // TODO: Probably not good enough, but okay for now
                        return "Please enter a valid number.";
                    }
                    return true;
                }
            })
        })
    }

    override async insertRecordAsync(value: string) {
        let integerRecord = new IntegerRecord();
        integerRecord.value = parseInt(value); // TODO: Validation for parseInt
        integerRecord.metric = this.metric;
        await getRepository(IntegerRecord).save(integerRecord);
    }
}

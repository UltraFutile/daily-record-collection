import * as inquirer from 'inquirer';
import { Metric } from "../../entity/Metric";
import { PromptOptions } from './PromptOptions';

export abstract class AbstractRecordPrompt {
    constructor(protected metric: Metric) {}

    async executeAsync() {
        let recordPrompt: any = {
            name: 'inputValue',
            message: this.metric.promptText,
            ...await this.getPromptOptionsAsync()
        };

        let answers = await inquirer.prompt(recordPrompt);
        await this.insertRecordAsync(answers.inputValue);
    }

    protected abstract insertRecordAsync(inputValue: string): Promise<void>;

    protected abstract getPromptOptionsAsync(): Promise<PromptOptions>
}
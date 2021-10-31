import inquirer from 'inquirer';
import { getRepository } from "typeorm";
import { RecordType } from "../data/RecordType";
import { Metric } from "../entity/Metric";
import { AbstractRecordPrompt } from './record-prompts/AbstractRecordPrompt';
import { IntegerRecordPrompt } from './record-prompts/IntegerRecordPrompt';
import { ScaleRecordPrompt } from './record-prompts/ScaleRecordPrompt';
import { TextRecordPrompt } from './record-prompts/TextRecordPrompt';

function recordPromptFactory(metric: Metric): AbstractRecordPrompt {
    switch (metric.getRecordType()) {
        case RecordType.Integer:
            return new IntegerRecordPrompt(metric);
        case RecordType.Scale:
            return new ScaleRecordPrompt(metric);
        case RecordType.Text:
            return new TextRecordPrompt(metric);
        default:
            console.error("Unrecognized record type!");
            throw "recordPromptFactory error";
    }
}

export async function recordCommand() {
    let metrics: Metric[] = await getRepository(Metric).find();
    let answer = await inquirer.prompt({
        type: 'list',
        name: 'metricChoice',
        message: 'Which metric would you like to record?',
        choices: metrics.map(x => x.name)
    });

    // get the metric
    let metric: Metric = metrics.find(x => x.name === answer.metricChoice);
    await recordPromptFactory(metric).executeAsync();    
}

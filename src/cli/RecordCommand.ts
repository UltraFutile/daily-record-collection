import inquirer from 'inquirer';
import { getRepository } from "typeorm";
import { RecordType } from "../data/RecordType";
import { Choice } from "../entity/Choice";
import { Metric } from "../entity/Metric";
import { IntegerRecord } from "../entity/records/IntegerRecord";
import { ScaleRecord } from "../entity/records/ScaleRecord";
import { TextRecord } from "../entity/records/TextRecord";

export default async function recordCommand () {
    let metrics: Metric[] = await getRepository(Metric).find();
    let metricChoiceAnswer = await inquirer.prompt({
        type: 'list',
        name: 'metricChoice',
        message: 'Which metric would you like to record?',
        choices: metrics.map(x => x.name)
    });

    // get the metric
    let metric: Metric = metrics.find(x => x.name === metricChoiceAnswer.metricChoice);
    
    // get choices
    // TODO: I'm sure TypeORM supports a way to get both metric and choices in one query
    let choices: Choice[];
    if (metric.getRecordType() === RecordType.Scale) {
        choices = await getRepository(Choice).find({metric: metric});
    }


    // base prompt
    let recordPrompt: any = {
        name: 'metricValue',
        message: metric.promptText
    };

    // TODO: There's probably a better way to organize this code
    // instead of constantly using switch statements everywhere
    switch (metric.getRecordType()) {
        case RecordType.Integer:
            recordPrompt.type = 'input';
            break;
        case RecordType.Scale:
            recordPrompt.type = 'list';
            recordPrompt.choices = choices.map(x => x.name); // TODO: validation for choice list assumed here! bad?
            break;
        case RecordType.Text:
            recordPrompt.type = 'input';
            break;
        default:
            console.error("Unrecognized record type!")
            break;
    }

    let answers = await inquirer.prompt(recordPrompt);
    
    switch (metric.getRecordType()) {
        case RecordType.Integer:
            let integerRecord = new IntegerRecord();
            integerRecord.value = parseInt(answers.metricValue); // TODO: Validation for parseInt
            integerRecord.metric = metric;
            await getRepository(IntegerRecord).save(integerRecord);
            break;
        case RecordType.Scale:
            let choice: Choice = choices.find(x => x.name === answers.metricValue);
            let scaleRecord = new ScaleRecord();
            scaleRecord.choice = choice; // TODO: inconsistent name? Other records use 'value'...
            scaleRecord.metric = metric;
            await getRepository(ScaleRecord).save(scaleRecord);
            break;
        case RecordType.Text:
            let textRecord = new TextRecord();
            textRecord.value = answers.metricValue; // TODO: Validation for string input
            textRecord.metric = metric;
            await getRepository(TextRecord).save(textRecord);
            break;
        default:
            console.error("Unrecognized record type!")
            break;
    }
}
import inquirer from 'inquirer';
import { getRepository } from "typeorm";
import { RecordType } from "../data/RecordType";
import { Choice } from '../entity/Choice';
import { Metric } from "../entity/Metric";

export async function createMetricCommand () {
    let answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'metricName',
            message: 'What would you like to name the metric?',
            async validate (answer: string) {
                if (answer) {
                    let metric = await getRepository(Metric).findOne({ name: answer});
                    if (metric) {
                        console.log(` Metric with name ${answer} already exists! Please try a different name.`)
                        return false;
                    }
                    return true;
                }
                console.log('Please enter a value');
                return false;
            }
        },
        {
            type: 'input',
            name: 'metricPrompt',
            message: 'What should the prompt text be for this metric?'
        },
        {
            type: 'list',
            name: 'metricType',
            message: 'What kind of metric is this?',
            choices: [
                RecordType.Integer,
                RecordType.Scale,
                RecordType.Text
            ]
        },
        
    ])
    
    console.log(answers);

    let choices: [string, number][] = [];
    if (RecordType[answers.metricType] === RecordType.Scale) {
        await inputChoices(choices);
    }
    await createMetric(answers.metricName, RecordType[answers.metricType], answers.metricPrompt, choices);
}

async function createMetric(metricName: string, recordType: RecordType, promptText: string, choices?: [string, number][]) {
    const metric = new Metric();
    metric.name = metricName;
    metric.recordType = recordType.toString();
    metric.promptText = promptText;
    let newMetric: Metric = await getRepository(Metric).save(metric);

    if (choices) {
        choices.forEach(async c => {
            const choice = new Choice();
            choice.name = c[0];
            choice.metric = newMetric;
            choice.value = c[1];
            await getRepository(Choice).save(choice);
        })
    }
}

async function inputChoices(choices: [string, number][]): Promise<void> {
    let answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'choiceValue',
            message: 'Please enter the choice name and value pair delimted by a comma (e.g. good, 10).'
        },
        {
            type: 'confirm',
            name: 'askAgain',
            message: 'Want to enter another choice (just hit enter for YES)?',
            default: true,
        }
    ]); 
    
    let words: string[] = answers.choiceValue.split(',');
    choices.push([words[0].trim(), parseInt(words[1].trim())]);

    if (answers.askAgain) {
        await inputChoices(choices);
    }
    else {
        // TODO: Should validate, at least one choice should be created.
        console.log(choices);
    }
}
import * as inquirer from 'inquirer';
import { getRepository } from "typeorm";
import { RecordType } from "../data/RecordType";
import { Choice } from '../entity/Choice';
import { Metric } from "../entity/Metric";

export async function createMetricCommand () {
    let newMetricInputs = await inputMetric();
    let choices: [string, number][];

    if (RecordType[newMetricInputs.type] === RecordType.Scale) {
        choices  = [];
        await inputChoices(choices);
    }
    await finalConfirmation(newMetricInputs.name, RecordType[newMetricInputs.type], newMetricInputs.prompt, choices);
}

async function inputMetric(): Promise<{ name: string, type: string, prompt: string }> {
    return await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What would you like to name the metric?',
            async validate (answer: string) {
                if (answer) {
                    let metric = await getRepository(Metric).findOne({ name: answer});
                    if (metric) {
                        return `Metric with name ${answer} already exists! Please try a different name.`;
                    }
                    return true;
                }
                // TODO: Still not ideal in that I can't escape from this command until the confirmation step
                return 'Please enter a value';
            }
        },
        {
            type: 'input',
            name: 'prompt',
            message: 'What should the prompt text be for this metric?'
        },
        {
            type: 'list',
            name: 'type',
            message: 'What kind of metric is this?',
            choices: [
                RecordType.Integer,
                RecordType.Scale,
                RecordType.Text
            ]
        }        
    ]);
}

async function finalConfirmation(metricName: string, recordType: RecordType, promptText: string, choices?: [string, number][]) {
    let answers = await inquirer.prompt({
        type: 'list',
        name: 'finalDecision',
        message: `Does everything here like correct?:
        \tMetric Name: ${metricName}
        \tRecord Type: ${recordType}
        \tPrompt Text: ${promptText}
        ${(choices) ? `\tChoices: ${choices.map(c => `[${c}]`)}` : ''}`,
        choices: [
            'Yes',
            'Cancel'
        ]
    });

    if (answers.finalDecision === 'Yes') {
        await createMetric(metricName, RecordType[recordType], promptText, choices);
    }
    else {
        console.log("Cancel metric creation, back to main menu.");
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

async function createMetric(metricName: string, recordType: RecordType, promptText: string, choices?: [string, number][]) {
    const metric = new Metric();
    metric.name = metricName;
    metric.recordType = recordType.toString();
    metric.promptText = promptText;
    let newMetric: Metric = await getRepository(Metric).save(metric);

    if (choices) {
        await getRepository(Choice).save(
            choices.map(c => {
                const choice = new Choice()
                choice.name = c[0];
                choice.metric = newMetric;
                choice.value = c[1];
                return choice;
            })
        );
    }
}
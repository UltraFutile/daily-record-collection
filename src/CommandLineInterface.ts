import inquirer from 'inquirer';
import {getConnection, getRepository} from "typeorm";
import { RecordType } from './data/RecordType';
import { Choice } from './entity/Choice';
import { Metric } from './entity/Metric';
import { IntegerRecord } from './entity/records/IntegerRecord';
import { ScaleRecord } from './entity/records/ScaleRecord';
import { TextRecord } from './entity/records/TextRecord';

export function commandLineInterface() {
    main();
}

// Setup inquirer prompt
function main() {
    console.log('Welcome to your daily record collection!');
    menu();
}

enum MainMenuChoices {
    Record = "Record",
    ListMetrics = "List metrics",
    CreateMetric = "Create new metric",
    DeleteMetric = "Delete metric",
    Exit = "Exit"
}

async function menu() {
    const menuPrompt = {
        type: 'list',
        name: 'mainMenu',
        message: 'Select an action to perform:',
        choices: [
            MainMenuChoices.Record,
            MainMenuChoices.ListMetrics,
            MainMenuChoices.CreateMetric,
            MainMenuChoices.DeleteMetric,
            MainMenuChoices.Exit
        ]
    }

    let answers = await inquirer.prompt(menuPrompt);
    switch(answers.mainMenu) {
        case MainMenuChoices.Record:
            await record();
            menu();
            break;
        case MainMenuChoices.ListMetrics:
            await listMetrics();
            menu();
            break;
        case MainMenuChoices.CreateMetric:
            await inputMetric();
            menu();
            break;
        case MainMenuChoices.DeleteMetric:
            await deleteMetric();
            menu();
            break;
        case MainMenuChoices.Exit:
            getConnection().close();
            process.exit(0);
        default:
            console.error("Main menu answer error. Answers object:");
            console.log(answers);
            break;
    }
}

async function record() {
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

async function listMetrics() {
    let metrics = await getRepository(Metric).find();
    console.log(metrics);
}

async function inputMetric() {
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

/**
 * TODO: implement way to 'back out' of selecting this option
 */
async function deleteMetric() {
    let metrics: Metric[] = await getRepository(Metric).find();
    let metricChoiceAnswer = await inquirer.prompt({
            type: 'list',
            name: 'metricChoice',
            message: 'Which metric would you like to record?',
            choices: metrics.map(x => x.name)
    });

    // get the metric
    let metric: Metric = metrics.find(x => x.name === metricChoiceAnswer.metricChoice);
    await getRepository(Metric).remove(metric);
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
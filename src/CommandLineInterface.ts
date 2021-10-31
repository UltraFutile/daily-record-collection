import inquirer from 'inquirer';
import {getConnection} from "typeorm";
import { ChoiceRepository } from './data/ChoiceRepository';
import { MetricRepository } from './data/MetricRepository';
import { RecordType } from './data/RecordType';
import { Metric } from './entity/Metric';

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
            MainMenuChoices.Exit
        ]
    }

    let answers = await inquirer.prompt(menuPrompt);
    switch(answers.mainMenu) {
        case MainMenuChoices.Record:
            record();
            break;
        case MainMenuChoices.ListMetrics:
            await listMetrics();
            menu();
            break;
        case MainMenuChoices.CreateMetric:
            await inputMetric()
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
    const repo = new MetricRepository();
    let metrics: Metric[] = await repo.readAllAsync();

    let answers = await inquirer.prompt({
            type: 'list',
            name: 'metricChoice',
            message: 'Which metric would you like to record?',
            choices: metrics.map(x => x.name)
    });

    console.log(answers.metricChoice);

    // get the metric
    let metric: Metric = metrics.find(x => x.name === answers.metricChoice);
    metric.getRecordType();

    // base prompt
    let prompt = {
        type: 'input',
        name: 'metricValue',
        message: metric.promptText
    };

    inquirer.prompt({
        
    })
    menu();
}

async function listMetrics() {
    const repo = new MetricRepository();
    let metrics = await repo.readAllAsync();
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
                    const repo = new MetricRepository();
                    let metric = await repo.readAsync(answer);
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
    createMetric(answers.metricName, RecordType[answers.metricType], answers.metricPrompt, choices);
}

async function createMetric(metricName: string, recordType: RecordType, promptText: string, choices?: [string, number][]) {
    const metricRepo = new MetricRepository();
    let newMetric: Metric = await metricRepo.createAsync(metricName, recordType, promptText);

    if (choices) {
        const choiceRepo = new ChoiceRepository();
        choices.forEach(async c => {
            await choiceRepo.createAsync(c[0], newMetric, c[1])
        })
    }

    menu();
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
        console.log(choices);
    }
}
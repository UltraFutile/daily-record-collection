import inquirer from 'inquirer';
import {getConnection} from "typeorm";
import { MetricRepository } from './data/MetricRepository';
import { RecordType } from './data/RecordType';

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

function menu() {
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


    inquirer.prompt(menuPrompt).then(async (answers) => {
        switch(answers.mainMenu) {
            case MainMenuChoices.Record:
                record();
                break;
            case MainMenuChoices.ListMetrics:
                await listMetrics();
                menu();
                break;
            case MainMenuChoices.CreateMetric:
                createMetric()
                break;
            case MainMenuChoices.Exit:
                getConnection().close();
                process.exit(0);
            default:
                console.error("Main menu answer error. Answers object:");
                console.log(answers);
                break;
        }
    });
}

function record() {
    const inputRequestPrompt = {
        type: 'input',
        name: 'listMetrics',
        message: 'Which metric would you like to record?',
    };

    inquirer.prompt(inputRequestPrompt).then((answers) => {
        console.log(answers.listMetrics);
        menu();
    });
}

async function listMetrics() {
    const repo = new MetricRepository();
    let metrics = await repo.readAllAsync();
    console.log(metrics);
}

function createMetric() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'metricName',
            message: 'What would you like to name the metric?',
            validate (answer: string) {
                if (answer) return true;
                console.log('Please enter a value');
                return false;
            }
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
        {
            type: 'input',
            name: 'metricPrompt',
            message: 'What should the prompt text be for this metric?'
        },
    ])
    .then(async (answers) => {
        console.log(answers);
        const repo = new MetricRepository();
        await repo.createAsync(answers.metricName, RecordType[answers.metricType], answers.metricPrompt)
        menu();
    });
}

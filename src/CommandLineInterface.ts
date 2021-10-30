import inquirer from 'inquirer';
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


    inquirer.prompt(menuPrompt).then((answers) => {
        switch(answers.mainMenu) {
            case MainMenuChoices.Record:
                nameNewPuppy();
                break;
            case MainMenuChoices.ListMetrics:
                listCurrentPuppies();
                menu();
                break;
            case MainMenuChoices.CreateMetric:
                createMetric()
                break;
            case MainMenuChoices.Exit:
                process.exit(0);
            default:
                console.error("Main menu answer error. Answers object:");
                console.log(answers);
                break;
        }
    });
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
    .then((answers) => {
        console.log(answers);
        const repo = new MetricRepository();
        repo.create(answers.metricName, RecordType[answers.metricType], answers.metricPrompt)

        menu();
    });
}


function nameNewPuppy() {
    const inputRequestPrompt = {
        type: 'input',
        name: 'dogNameRequest',
        message: 'What would you like to name the newborn puppy?',
    };

    inquirer.prompt(inputRequestPrompt).then((answers) => {
        // repository.insert(answers.dogNameRequest);
        console.log(answers.dogNameRequest);
        menu();
    });
}

function listCurrentPuppies() {
    // let dogs = repository.select();
    // dogs.forEach(dog => {
    //     console.log(dog.name);
    // })
    console.log("List current puppies!");
}
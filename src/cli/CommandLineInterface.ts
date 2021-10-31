import inquirer from 'inquirer';
import {getConnection} from "typeorm";
import {createMetricCommand} from './CreateMetricCommand';
import {deleteMetricCommand} from './DeleteMetricCommand';
import {listMetricsCommand} from './ListMetricsCommand';
import {recordCommand} from './RecordCommand';

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
            await recordCommand();
            menu();
            break;
        case MainMenuChoices.ListMetrics:
            await listMetricsCommand();
            menu();
            break;
        case MainMenuChoices.CreateMetric:
            await createMetricCommand();
            menu();
            break;
        case MainMenuChoices.DeleteMetric:
            await deleteMetricCommand();
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

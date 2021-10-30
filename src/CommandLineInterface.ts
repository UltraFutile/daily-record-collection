import inquirer from 'inquirer';

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
        switch(answers.mainMenu ) {
            case MainMenuChoices.Record:
                nameNewPuppy();
                break;
            case MainMenuChoices.ListMetrics:
                listCurrentPuppies();
                menu();
                break;
            case MainMenuChoices.CreateMetric:
                console.log("Created new metric");
                menu();
                break;
            case MainMenuChoices.Exit:
                process.exit(0);
                break;
            default:
                console.log("Default")
                break;   
        }
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
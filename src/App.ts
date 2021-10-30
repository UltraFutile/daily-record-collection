import inquirer from 'inquirer';

// Setup inquirer prompt
function main() {
    console.log('We have been blessed with a new litter of puppies! We should try to name them all!');
    menu();

}

function menu() {
    const menuPrompt = {
        type: 'list',
        name: 'mainMenu',
        message: 'Select an action:',
        choices: ['Name a new puppy', 'List new puppy names', 'Exit']
    }

    inquirer.prompt(menuPrompt).then((answers) => {
        if (answers.mainMenu === 'Name a new puppy') {
            nameNewPuppy();
        }
        else if (answers.mainMenu === 'List new puppy names') {
            listCurrentPuppies();
            menu();
        }
        else if (answers.mainMenu === 'Exit') {
            process.exit(0);
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

main();

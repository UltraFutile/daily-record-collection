const inquirer = require('inquirer');
const sqlite3 = require('better-sqlite3');

// Initialize DB connection
const db = new sqlite3(':memory:', { verbose: console.log });

// Initialize DB tables
const stmt = db.prepare('CREATE TABLE dog (name Text)');
stmt.run();

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
            db.close();
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
        let insertStmt = db.prepare('INSERT INTO dog (name) VALUES (@name)');
        let insertMany = db.transaction((dogs) => {
            for (let dog of dogs) {
                insertStmt.run(dog);
            }
        });
        insertMany([
            { name: answers.dogNameRequest }
        ]);

        menu();
    });
}

function listCurrentPuppies() {
    let dogs = db.prepare('SELECT (name) from dog').all();
    dogs.forEach(dog => {
        console.log(dog.name);
    })
}

main();

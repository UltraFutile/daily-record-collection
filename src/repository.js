import sqlite3 from 'better-sqlite3';

class Repository {
    constructor() {
        this.db = new sqlite3(':memory:');
    }

    createTable() {
        this.db.prepare('CREATE TABLE dog (name Text)').run();
    }

    insert(name) {
        let insertStmt = this.db.prepare('INSERT INTO dog (name) VALUES (@name)');
        let insertMany = this.db.transaction((dogs) => {
            for (let dog of dogs) {
                insertStmt.run(dog);
            }
        });
        insertMany([
            { name: name }
        ]);
    }

    select() {
        return this.db.prepare('SELECT (name) from dog').all();
    }

    close() {
        this.db.close();
    }
}

export default Repository;
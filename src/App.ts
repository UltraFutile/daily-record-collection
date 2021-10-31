import { commandLineInterface } from './cli/CommandLineInterface';
import {createConnection, getConnection} from "typeorm";

createConnection().then(async connection => {
    try {
        commandLineInterface();
    }
    catch(err) {
        console.error(err);
        await getConnection().close();
    }
}).catch(error => console.log(error));

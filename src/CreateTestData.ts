import {createConnection} from "typeorm";
import { Choice } from "./entity/Choice";
import { Metric } from "./entity/Metric";
import { ScaleRecord } from "./entity/records/ScaleRecord";

function createTestData () {
    createConnection().then(async connection => {

        // Test Scale record
        const testMetric = new Metric();
        testMetric.name = "test metric";
        testMetric.type = "set-and-forget";
        await connection.manager.save(testMetric);
    
        const choice1 = new Choice();
        choice1.metric = testMetric;
        choice1.name = "Excellent";
        choice1.value = 5
        await connection.manager.save(choice1);
    
        const choice2 = new Choice();
        choice2.metric = testMetric;
        choice2.name = "Very Poor";
        choice2.value = 0
        await connection.manager.save(choice2);
    
        const scaleRecord1 = new ScaleRecord();
        scaleRecord1.metric = testMetric;
        scaleRecord1.choice = choice1;
    
        const scaleRecord2 = new ScaleRecord();
        scaleRecord2.metric = testMetric;
        scaleRecord2.choice = choice2;
    
        const scaleRecord3 = new ScaleRecord();
        scaleRecord3.metric = testMetric;
        scaleRecord3.choice = choice2;
    
        await connection.manager.save(scaleRecord1);
        await connection.manager.save(scaleRecord2);
        await connection.manager.save(scaleRecord3);
    
        connection.close();
    }).catch(error => console.log(error));   
}

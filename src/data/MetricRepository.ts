import {createConnection} from "typeorm";
import { Metric } from "./../entity/Metric";
import { RecordType } from "./RecordType";

export class MetricRepository {
    create(name: string, recordType: RecordType, promptText: string) {
        createConnection().then(async connection => {

            // Test Scale record
            const metric = new Metric();
            metric.name = name;
            metric.recordType = recordType.toString();
            metric.promptText = promptText;

            await connection.getRepository(Metric).save(metric);

            connection.close();
        }).catch(error => console.log(error));   
    }
}
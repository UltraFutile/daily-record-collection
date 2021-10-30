import {getRepository} from "typeorm";
import { Metric } from "./../entity/Metric";
import { RecordType } from "./RecordType";

export class MetricRepository {
    async createAsync(name: string, recordType: RecordType, promptText: string): Promise<void> {
        const metric = new Metric();
        metric.name = name;
        metric.recordType = recordType.toString();
        metric.promptText = promptText;
        getRepository(Metric).save(metric);
    }

    async readAllAsync(): Promise<Metric[]> {
        return getRepository(Metric).find();
    }
}
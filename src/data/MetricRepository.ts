import {getRepository} from "typeorm";
import { Metric } from "./../entity/Metric";
import { RecordType } from "./RecordType";

/**
 * TODO: Maybe it's better to use the TypeORM repositories 
 * and utilize constructors for entities
 */
export class MetricRepository {
    async createAsync(name: string, recordType: RecordType, promptText: string): Promise<Metric> {
        const metric = new Metric();
        metric.name = name;
        metric.recordType = recordType.toString();
        metric.promptText = promptText;
        return getRepository(Metric).save(metric);
    }

    async readAsync(name: string): Promise<Metric> {
        return getRepository(Metric).findOne({ name: name});
    }

    async readAllAsync(): Promise<Metric[]> {
        return getRepository(Metric).find();
    }
}
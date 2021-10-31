import {getRepository} from "typeorm";
import { Choice } from "../entity/Choice";
import { Metric } from "./../entity/Metric";

export class ChoiceRepository {
    async createAsync(name: string, metric: Metric, value: number): Promise<Choice> {
        const choice = new Choice();
        choice.name = name;
        choice.metric = metric;
        choice.value = value;
        return getRepository(Choice).save(choice);
    }

    async readAllAsync(): Promise<Choice[]> {
        return getRepository(Choice).find();
    }
}
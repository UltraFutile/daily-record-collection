import { getRepository } from "typeorm";
import { Metric } from "../entity/Metric";

export default async function listMetricsCommand (): Promise<void> {
    let metrics: Metric[] = await getRepository(Metric).find();

    for (const metric of metrics) {
        console.log(metric)
        // let choices = await metric.choices;
        // console.log(choices)
    }
}
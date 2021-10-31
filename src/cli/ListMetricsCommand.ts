import { getRepository } from "typeorm";
import { Metric } from "../entity/Metric";

export default async function listMetricsCommand () {
    let metrics = await getRepository(Metric).find();
    console.log(metrics);
}
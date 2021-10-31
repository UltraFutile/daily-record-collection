import inquirer from 'inquirer';
import { getRepository } from "typeorm";
import { Metric } from "../entity/Metric";

/**
 * TODO: implement way to 'back out' of selecting this option
 */
export async function deleteMetricCommand() {
    let metrics: Metric[] = await getRepository(Metric).find();
    let metricChoiceAnswer = await inquirer.prompt({
            type: 'list',
            name: 'metricChoice',
            message: 'Which metric would you like to record?',
            choices: metrics.map(x => x.name)
    });

    // get the metric
    let metric: Metric = metrics.find(x => x.name === metricChoiceAnswer.metricChoice);
    await getRepository(Metric).remove(metric);
}

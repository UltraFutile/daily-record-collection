import inquirer from 'inquirer';
import { getRepository } from "typeorm";
import { Metric } from "../entity/Metric";

export async function deleteMetricCommand() {
    let metrics: Metric[] = await getRepository(Metric).find();
    let answer = await inquirer.prompt({
            type: 'list',
            name: 'metricChoice',
            message: 'Which metric would you like to delete?',
            choices: [ // TODO: Repeating same code from RecordCommand class!!!
                ...metrics.map(x => ({ name: x.name, value: x.id})), 
                new inquirer.Separator(), 
                {name: "Cancel", value: -1}
            ]
    });

    // TODO: See comment on RecordCommand class!!!
    if (answer.metricChoice === -1) {
        return;
    }

    // get the metric
    let metric: Metric = metrics.find(x => x.id === answer.metricChoice);
    await getRepository(Metric).remove(metric);
}

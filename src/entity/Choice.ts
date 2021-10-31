import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Metric } from "./Metric";

@Entity()
export class Choice {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Metric, {
        onDelete: "CASCADE"
    })
    metric: Metric;

    @Column()
    value: number;
}

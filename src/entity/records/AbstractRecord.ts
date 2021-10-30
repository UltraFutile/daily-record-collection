import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Metric } from "../Metric";

/**
 */
@Entity()
export abstract class AbstractRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Metric)
    metric: Metric;

    @Column({
        type: "datetime",
        default: () => "CURRENT_TIMESTAMP"
    })
    timestamp: string;
}

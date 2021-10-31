import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Metric } from "../Metric";

/**
 * Base class for all other records.
 * TODO: Still not totally sure about having separate records for all tables
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

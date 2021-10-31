import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { RecordType } from "../data/RecordType";
import { Choice } from "./Choice";

/**
 * Defines a metric that will be recorded
 */
@Entity()
export class Metric {
    @PrimaryGeneratedColumn()
    id: number;

    // user defined name
    @Column({
        unique: true
    })
    name: string;

    /**
     * type of metric:
     * - 'sets' - NOT IMPLEMENTED YET!!!
     * - 'Scale'
     * - 'Integer'
     * - 'Text'
     */ 
    @Column()
    recordType: string;

    getRecordType(): RecordType {
        return RecordType[this.recordType];
    }

    @Column()
    promptText: string;

    @OneToMany(() => Choice, choice => choice.metric)
    choices: Promise<Choice[]>;
}

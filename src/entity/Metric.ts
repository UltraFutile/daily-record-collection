import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import { RecordType } from "../data/RecordType";

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
     * - 'sets' - NOT IMPLEMENTED
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
}

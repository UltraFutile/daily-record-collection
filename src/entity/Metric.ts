import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

/**
 * Defines a metric that will be recorded
 */
@Entity()
export class Metric {
    @PrimaryGeneratedColumn()
    id: number;

    // user defined name
    @Column()
    name: string;

    /**
     * type of metric:
     * - 'sets'
     * - 'scale'
     * - 'digit'
     * - 'text'
     */ 
    @Column()
    recordType: string;

    @Column()
    promptText: string;
}

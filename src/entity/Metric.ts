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
     * 'sets-of-reps'
     * 'scale'
     * 'boolean'
     * 'digit'
     * 'text'
     */ 
    @Column()
    type: string;
}

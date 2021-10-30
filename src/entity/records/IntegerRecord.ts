import {Entity, Column} from "typeorm";
import { AbstractRecord } from "./AbstractRecord";

/**
 * Records single integer value.
 * For sets-and-reps, multiple rows will be recorded
 */
@Entity()
export class IntegerRecord extends AbstractRecord {
    @Column()
    value: number;
}

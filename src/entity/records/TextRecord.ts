import {Column, Entity} from "typeorm";
import { AbstractRecord } from "./AbstractRecord";

@Entity()
export class TextRecord extends AbstractRecord {
    @Column()
    value: string;
}

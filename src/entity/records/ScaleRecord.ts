import {Entity, ManyToOne} from "typeorm";
import { Choice } from "../Choice";
import { AbstractRecord } from "./AbstractRecord";

@Entity()
export class ScaleRecord extends AbstractRecord {
    @ManyToOne(type => Choice)
    choice: Choice;
}

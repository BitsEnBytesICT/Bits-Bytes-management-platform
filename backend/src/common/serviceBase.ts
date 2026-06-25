import { daoBase } from "./daoBase";
import { KeyValuePair } from "./Validator";

export default interface serviceBase<a> {
    dao: daoBase<a>;
    create(...args: any[]): void;
    update(where: KeyValuePair<a>, ...args: KeyValuePair<a>[]): void;
    delete(...args: any[]): void;
    list(...args: any[]): Promise<a[]>;
    findOne(...args: KeyValuePair<a>[]): Promise<a>;
}
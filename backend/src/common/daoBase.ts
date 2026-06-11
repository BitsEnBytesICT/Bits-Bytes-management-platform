import { KeyValuePair } from "./Validator";

export default interface daoBase<a> {
    create(...args: any[]): void;
    update(where: KeyValuePair<a>, ...args: KeyValuePair<a>[]): void;
    delete(...args: any[]): void;
    list(...args: any[]): a[];
    findOne(...args: KeyValuePair<a>[]): a;
}
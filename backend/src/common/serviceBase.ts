import daoBase from "./daoBase";

export default interface serviceBase<a> {
    dao: daoBase<a>;
    create(...args: any[]): void;
    update(...args: any[]): void;
    delete(...args: any[]): void;
    list(...args: any[]): a[];
}
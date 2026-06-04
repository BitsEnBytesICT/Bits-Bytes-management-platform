export default interface daoBase<a> {
    create(...args: any[]): void;
    update(...args: any[]): void;
    delete(...args: any[]): void;
    list(...args: any[]): a[];
}
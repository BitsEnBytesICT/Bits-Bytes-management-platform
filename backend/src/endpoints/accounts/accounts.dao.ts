import daoBase from "../../common/daoBase";
import IAccount from "../../types/accounts/IAccount";

export default class AccountDAO implements daoBase<IAccount> {

    create(...args: any[]): void {
        throw new Error("Method not implemented.");
    }
    update(...args: any[]): void {
        throw new Error("Method not implemented.");
    }
    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }
    list(...args: any[]): IAccount[] {
        throw new Error("Method not implemented.");
    }
}
import serviceBase from "../../common/serviceBase";
import { KeyValuePair } from "../../common/Validator";
import IAccount from "../../types/accounts/IAccount";
import AccountDAO from "./accounts.dao";

export default class AccountService implements serviceBase<IAccount> {
    dao: AccountDAO;

    constructor() {
        this.dao = new AccountDAO();
    }

    findOne(...args: KeyValuePair<IAccount>[]): IAccount {
        throw new Error("Method not implemented.");
    }

    create(account: IAccount): void {
        throw new Error("Method not implemented.");
    }
    update(...args: any[]): void {
        throw new Error("Method not implemented.");
    }
    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }
    list(): IAccount[] {
        return this.dao.list();
    }
}
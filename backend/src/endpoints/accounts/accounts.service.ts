import serviceBase from "../../common/serviceBase";
import { KeyValuePair } from "../../common/Validator";
import IAccount from "../../types/accounts/IAccount";
import AccountDAO from "./accounts.dao";

export default class AccountService implements serviceBase<IAccount> {
    dao: AccountDAO;

    constructor() {
        this.dao = new AccountDAO();
    }

    async findOne(...where: KeyValuePair<IAccount>[]): Promise<IAccount> {
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
    async list(): Promise<IAccount[]> {
        return await this.dao.list();
    }
}
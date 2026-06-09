import serviceBase from "../../common/serviceBase";
import IAccount from "../../types/accounts/IAccount";
import AccountDAO from "./accounts.dao";


export default class AccountService implements serviceBase<IAccount> {
    dao: AccountDAO;

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
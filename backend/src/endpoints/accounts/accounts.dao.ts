import { daoBase, daoBaseType } from "../../common/daoBase";
import { dbAll } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import IAccount from "../../types/accounts/IAccount";

export default class AccountDAO extends daoBase<IAccount> implements daoBaseType<IAccount> {

    findOne(...args: KeyValuePair<IAccount>[]): IAccount {
        throw new Error("Method not implemented.");
    }
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
        return dbAll('SELECT * FROM Accounts');
    }
}
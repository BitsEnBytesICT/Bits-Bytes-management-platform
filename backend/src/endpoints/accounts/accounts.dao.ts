import { daoBase, daoBaseType } from "../../common/daoBase";
import { dbAll } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import IAccount from "../../types/accounts/IAccount";

export default class AccountDAO extends daoBase<IAccount> implements daoBaseType<IAccount> {

    async findOne(...args: KeyValuePair<IAccount>[]): Promise<IAccount> {
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
    async list(...args: any[]): Promise<IAccount[]> {
        return await dbAll('SELECT * FROM Accounts');
    }
}
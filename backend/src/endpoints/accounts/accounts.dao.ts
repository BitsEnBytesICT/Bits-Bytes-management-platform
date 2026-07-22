import { daoBase, daoBaseType } from "../../common/daoBase";
import { dbAll } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import IAccount from "../../types/accounts/IAccount";
import { Tables } from "../../types/tables/tablesList";

export default class AccountDAO extends daoBase<IAccount> implements daoBaseType<IAccount> {

    async findOne(...where: KeyValuePair<IAccount>[]): Promise<IAccount | undefined> {
        return await this.findOneFunc(Tables.Accounts, ...where);
    }

    async create(account: IAccount) {
        await this.createFunc(Tables.Accounts, ...Object.entries(account) as KeyValuePair<IAccount>[]);
    }

    update(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    async delete(where: KeyValuePair<IAccount>) {
        await this.deleteFunc(Tables.Accounts, where);
    }

    async list(...args: any[]): Promise<IAccount[]> {
        return await dbAll('SELECT * FROM Accounts');
    }
}
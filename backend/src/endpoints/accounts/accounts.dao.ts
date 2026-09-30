import { daoBase, daoBaseType } from "../../common/daoBase";
import { dbAll } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import IAccount from "../../types/accounts/IAccount";
import { Tables } from "../../types/tables/tablesList";

type JsonColumn = "calendars" | "shortcuts";

const jsonColumns: JsonColumn[] = ["calendars", "shortcuts"];

export default class AccountDAO extends daoBase<IAccount> implements daoBaseType<IAccount> {

    async findOne(...where: KeyValuePair<IAccount>[]): Promise<IAccount | undefined> {
        const account = await this.findOneFunc(Tables.Accounts, ...where);
        return account && this.withParsedJson(account);
    }

    async create(account: IAccount) {
        await this.createFunc(Tables.Accounts, ...Object.entries(this.withStoredJson(account)) as KeyValuePair<IAccount>[]);
    }

    async update(where: KeyValuePair<IAccount>, ...args: KeyValuePair<IAccount>[]) {
        await this.updateFunc(Tables.Accounts, where, ...args.map(([key, value]) =>
            (jsonColumns.includes(key as JsonColumn) && value !== undefined ? [key, JSON.stringify(value)] : [key, value]) as KeyValuePair<IAccount>));
    }

    async delete(where: KeyValuePair<IAccount>) {
        await this.deleteFunc(Tables.Accounts, where);
    }

    async list(...args: any[]): Promise<IAccount[]> {
        const accounts = await dbAll<IAccount>('SELECT * FROM Accounts');
        return accounts.map((account) => this.withParsedJson(account));
    }

    private withParsedJson(account: IAccount): IAccount {
        const parsed = {...account};

        for (const column of jsonColumns) {
            if (typeof account[column] !== "string") continue;

            try {
                const value = JSON.parse(account[column] as unknown as string);
                parsed[column] = Array.isArray(value) ? value : [];
            } catch {
                parsed[column] = [];
            }
        }

        return parsed;
    }

    private withStoredJson(account: IAccount): IAccount {
        const stored = {...account};

        for (const column of jsonColumns) {
            if (account[column] === undefined) continue;

            stored[column] = JSON.stringify(account[column]) as unknown as IAccount[typeof column];
        }

        return stored;
    }
}
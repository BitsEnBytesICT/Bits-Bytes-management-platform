import { daoBase, daoBaseType } from "../../common/daoBase";
import { dbAll } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import IAccount from "../../types/accounts/IAccount";
import ICalendar from "../../types/accounts/ICalendar";
import { Tables } from "../../types/tables/tablesList";

export default class AccountDAO extends daoBase<IAccount> implements daoBaseType<IAccount> {

    async findOne(...where: KeyValuePair<IAccount>[]): Promise<IAccount | undefined> {
        const account = await this.findOneFunc(Tables.Accounts, ...where);
        return account && this.withParsedCalendars(account);
    }

    async create(account: IAccount) {
        await this.createFunc(Tables.Accounts, ...Object.entries(this.withStoredCalendars(account)) as KeyValuePair<IAccount>[]);
    }

    async update(where: KeyValuePair<IAccount>, ...args: KeyValuePair<IAccount>[]) {
        await this.updateFunc(Tables.Accounts, where, ...args.map(([key, value]) =>
            (key === "calendars" ? [key, value === undefined ? undefined : JSON.stringify(value)] : [key, value]) as KeyValuePair<IAccount>));
    }

    async delete(where: KeyValuePair<IAccount>) {
        await this.deleteFunc(Tables.Accounts, where);
    }

    async list(...args: any[]): Promise<IAccount[]> {
        const accounts = await dbAll<IAccount>('SELECT * FROM Accounts');
        return accounts.map((account) => this.withParsedCalendars(account));
    }

    private withParsedCalendars(account: IAccount): IAccount {
        if (typeof account.calendars !== "string") return account;

        try {
            const calendars = JSON.parse(account.calendars) as ICalendar[];
            return { ...account, calendars: Array.isArray(calendars) ? calendars : [] };
        } catch {
            return { ...account, calendars: [] };
        }
    }

    private withStoredCalendars(account: IAccount): IAccount {
        if (account.calendars === undefined) return account;

        return { ...account, calendars: JSON.stringify(account.calendars) as unknown as ICalendar[] };
    }
}
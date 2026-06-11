import daoBase from "../../common/daoBase";
import { dbGet, dbQuery } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import IDeelnemer from "../../types/deelnemer/IDeelnemer";

export default class DeelnemerDao implements daoBase<IDeelnemer> {
    create(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    update(where: KeyValuePair<IDeelnemer>, ...args: KeyValuePair<IDeelnemer>[]): void {
        dbQuery(`UPDATE Deelnemers SET ${args.map(([key]) => 
            `${String(key)} = ?`).join(", ")} WHERE ${String(where[0])} = ?`, args.concat(where).map(([, value]) => value));
    }

    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    list(...args: any[]): IDeelnemer[] {
        throw new Error("Method not implemented.");
    }

    findOne(...args: KeyValuePair<IDeelnemer>[]): IDeelnemer {
        return dbGet(`SELECT * FROM Deelnemers WHERE ${args.map(([key, value]) => 
        value === undefined ? `${String(key)} IS NULL` : `${String(key)} = ?`).join(" AND ")} LIMIT 1`, 
        args.filter(([, value]) => value !== undefined).map(([, value]) => value));
    }
}
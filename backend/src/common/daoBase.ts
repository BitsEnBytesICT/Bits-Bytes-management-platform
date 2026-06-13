import { dbGet, dbQuery } from "./db";
import { KeyValuePair } from "./Validator";

export interface daoBaseType<a> {
    create(item: a): void;
    update(where: KeyValuePair<a>, ...args: KeyValuePair<a>[]): void;
    delete(...args: any[]): void;
    list(...args: any[]): a[];
    findOne(...args: KeyValuePair<a>[]): a;
}

export abstract class daoBase<a> {
    protected updateFunc(table: string, where: KeyValuePair<a>, ...args: KeyValuePair<a>[]) {
        dbQuery<a>(`UPDATE ${table} SET ${args.map(([key]) => 
                    `${String(key)} = ?`).join(", ")} WHERE ${String(where[0])} = ?`, args.concat([where]).map(([, value]) => value));
    }

    protected deleteFunc(...args: any[]) {
        
    }

    protected listFunc(...args: any[]) {
        
    }

    protected findOneFunc(table: string, ...args: KeyValuePair<a>[]) {
        return dbGet<a>(`SELECT * FROM ${table} WHERE ${args.map(([key, value]) => 
                value === undefined ? `${String(key)} IS NULL` : `${String(key)} = ?`).join(" AND ")} LIMIT 1`, 
                args.filter(([, value]) => value !== undefined).map(([, value]) => value));
    }
}
import { dbGet, dbQuery } from "./db";
import { KeyValuePair } from "./Validator";
import { Tables } from "../types/tables/tablesList";

export interface daoBaseType<a> {
    create(item: a): void;
    update(where: KeyValuePair<a>, ...args: KeyValuePair<a>[]): void;
    delete(...args: any[]): void;
    list(...args: any[]): Promise<a[]>;
    findOne(...args: KeyValuePair<a>[]): Promise<a>;
}

export abstract class daoBase<a> {
    protected async updateFunc(table: Tables, where: KeyValuePair<a>, ...values: KeyValuePair<a>[]) {
        await dbQuery<a>(`UPDATE ${table} SET ${values.map(([key]) => 
                    `${String(key)} = ?`).join(", ")} WHERE ${
                        where[1] === undefined ? `${String(where[0])} IS NULL` : `${String(where[0])} = ?`}`,
                        values.concat(where[1] === undefined ? [] : [where]).map(([, value]) => value));
    }

    protected async deleteFunc(...args: any[]) {
        
    }

    protected async listFunc(...args: any[]) {
        
    }

    protected async findOneFunc(table: Tables, ...where: KeyValuePair<a>[]) {
        return await dbGet<a>(`SELECT * FROM ${table} WHERE ${where.map(([key, value]) => 
                value === undefined ? `${String(key)} IS NULL` : `${String(key)} = ?`).join(" AND ")} LIMIT 1`, 
                where.filter(([, value]) => value !== undefined).map(([, value]) => value));
    }
}
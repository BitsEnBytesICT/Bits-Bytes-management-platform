import Database from 'better-sqlite3';
import IError from '../types/error/IError';
import { ErrorCodes } from '../types/error/ErrorCodes';

const db = new Database('database.db', { verbose: console.log });

const inventoryDB = new Database('inventoryDatabase.db', { verbose: console.log });

export const dbQuery = <T>(sql: string, values?: any[]): T => {
    try {
        return db.prepare(sql).run(values) as T;
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

export const dbGet = <T>(sql: string, values?: any[]): T => {
    try {
        return db.prepare(sql).get(values) as T;
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

export const dbAll = <T>(sql: string, values?: any[]): T => {
    try {
        return db.prepare(sql).all(values) as T;
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

export const inventoryDBQuery = <T>(sql: string, values?: any[]): T => {
    try {
        return inventoryDB.prepare(sql).run(values)as T;
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

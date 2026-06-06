import Database from 'better-sqlite3';
import IError from '../types/error/IError';
import { ErrorCodes } from '../types/error/ErrorCodes';

const db = new Database('database.db', { verbose: console.log });

const inventoryDB = new Database('inventoryDatabase.db', { verbose: console.log });

export const dbQuery = (sql: string, values?: any[]) => {
    try {
        return db.prepare(sql).run(values);
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

export const dbGet = (sql: string, values?: any[]) => {
    try {
        return db.prepare(sql).get(values);
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

export const dbAll = (sql: string, values?: any[]) => {
    try {
        return db.prepare(sql).all(values);
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

export const inventoryDBQuery = (sql: string, values?: any[]) => {
    try {
        return inventoryDB.prepare(sql).run(values);
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

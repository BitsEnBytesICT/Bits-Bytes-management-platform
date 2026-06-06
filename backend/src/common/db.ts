import Database from 'better-sqlite3';
import IError from '../types/error/IError';
import { ErrorCodes } from '../types/error/ErrorCodes';

const db = new Database('database.db', { verbose: console.log });

const inventoryDB = new Database('inventoryDatabase.db', { verbose: console.log });

export const dbQuery = (sql: string, values?: any[]) => {
    try {
        const statement = db.prepare(sql);
        return statement.run(values);
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
        const statement = inventoryDB.prepare(sql);
        return statement.run(values);
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}
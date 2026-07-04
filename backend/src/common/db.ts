import Database from 'better-sqlite3';
import IError from '../types/error/IError';
import { ErrorCodes } from '../types/error/ErrorCodes';
import mysql from 'mysql2/promise';
import sleep from './sleep';
import { runMigrations } from './migrationsLoader';

const db = new Database('database.db', { verbose: console.log });
export let managementDB: mysql.Connection;
let inventoryDB: mysql.Connection;

export const createConnection = async () => {
    try {
        managementDB = await mysql.createConnection({
        host: process.env.DATABASE_URL,
        user: process.env.DATABASE_USERNAME,
        port: Number(process.env.DATABASE_PORT),
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    });

    inventoryDB = await mysql.createConnection({
        host: process.env.DATABASE_URL,
        user: process.env.DATABASE_USERNAME,
        port: Number(process.env.DATABASE_PORT),
        password: process.env.DATABASE_PASSWORD,
        database: process.env.INVENTORYDB_NAME,
    });

    console.log("connected to databases");
    await runMigrations();
    console.log("finished migrations");
    } catch (error) {
        console.log("cannot create db connection or run migrations!");
        console.log(`error: ${error}`);
        try {
            managementDB.end();
            inventoryDB.end();
        } catch (error) {
            
        }
        await sleep(5000);
        createConnection();
    }
}

const inventoryDBSQLLITE = new Database('inventoryDatabase.db', { verbose: console.log });

export const dbQuery = async<T>(sql: string, values?: any[]): Promise<T> => {
    try {
        if (process.env.DATABASE_TYPE === "sqllite" && values) return db.prepare(sql).run(values) as T;
        else if (process.env.DATABASE_TYPE === "sqllite" && !values) return db.prepare(sql).run() as T;
        return (await managementDB.query(sql, values))[0] as T;
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

export const dbGet = async<T>(sql: string, values?: any[]): Promise<T> => {
    try {
        if (process.env.DATABASE_TYPE === "sqllite") return db.prepare(sql).get(values) as T;
        return (await managementDB.query(sql, values))[0] as T;
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

export const dbAll = async<T>(sql: string, values?: any[]): Promise<T> => {
    try {
        if (process.env.DATABASE_TYPE === "sqllite") return db.prepare(sql).all(values) as T;
        return (await managementDB.query(sql, values))[0] as T;
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

export const inventoryDBQuery = async<T>(sql: string, values?: any[]): Promise<T> => {
    try {
        if (process.env.DATABASE_TYPE === "sqllite") return inventoryDBSQLLITE.prepare(sql).run(values)as T;
        return (await inventoryDB.query(sql, values))[0] as T;
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}
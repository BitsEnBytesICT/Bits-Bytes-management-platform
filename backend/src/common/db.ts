import Database from 'better-sqlite3';
import IError from '../types/error/IError';
import { ErrorCodes } from '../types/error/ErrorCodes';
import mysql from 'mysql2/promise';
import sleep from './sleep';
import { runMigrations } from './migrationsLoader';

const db = new Database('database.db', { verbose: console.log });
export let managementDB: mysql.Pool;
let inventoryDB: mysql.Pool;

export const createConnection = async () => {
    while (true) {
        let managementPool: mysql.Pool | undefined;
        let inventoryPool: mysql.Pool | undefined;

        try {
            const poolOptions = {
                host: process.env.DATABASE_URL,
                user: process.env.DATABASE_USERNAME,
                port: Number(process.env.DATABASE_PORT),
                password: process.env.DATABASE_PASSWORD,
                waitForConnections: true,
                queueLimit: 0,
                keepAliveInitialDelay: 10000,
                enableKeepAlive: true,
            };

            managementPool = mysql.createPool({
                ...poolOptions,
                database: process.env.DATABASE_NAME,
            });
            inventoryPool = mysql.createPool({
                ...poolOptions,
                database: process.env.INVENTORYDB_NAME,
            });

            await Promise.all([
                managementPool.query("SELECT 1"),
                inventoryPool.query("SELECT 1"),
            ]);

            managementDB = managementPool;
            inventoryDB = inventoryPool;

            console.log("connected to databases");
            if (process.env.NODE_ENV !== "DEVELOPMENT") {
                await runMigrations();
                console.log("finished migrations");
            }
            return;
        } catch (error) {
            console.log("cannot create db connection or run migrations!");
            console.log(`error: ${error}`);
            await Promise.allSettled([
                managementPool?.end(),
                inventoryPool?.end(),
            ]);
            await sleep(5000);
            await createConnection();
        }
    }
}

const inventoryDBSQLLITE = new Database('inventoryDatabase.db', { verbose: console.log });

export const dbQuery = async<T>(sql: string, values?: any[]): Promise<T[]> => {
    try {
        if (process.env.DATABASE_TYPE === "sqllite") {
            let result;
            if (values) result = db.prepare(sql).run(values);
            else result = db.prepare(sql).run();
            if (Array.isArray(result)) return result as T[];
            return [result] as T[];
        } 
        return (await managementDB.query(sql, values))[0] as T[];
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

export const dbGet = async<T>(sql: string, values?: any[]): Promise<T[]> => {
    try {
        if (process.env.DATABASE_TYPE === "sqllite") {
            let result;
            if (values) result = db.prepare(sql).get(values);
            else result = db.prepare(sql).get();
            if (Array.isArray(result)) return result as T[];
            return [result] as T[];
        }
        return (await managementDB.query(sql, values))[0] as T[];
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

export const dbAll = async<T>(sql: string, values?: any[]): Promise<T[]> => {
    try {
        if (process.env.DATABASE_TYPE === "sqllite") {
            let result;
            if (values) result = db.prepare(sql).all(values);
            else result = db.prepare(sql).all();
            if (Array.isArray(result)) return result as T[];
            return [result] as T[];
        }
        return (await managementDB.query(sql, values))[0] as T[];
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

export const inventoryDBQuery = async<T>(sql: string, values?: any[]): Promise<T[]> => {
    try {
        if (process.env.DATABASE_TYPE === "sqllite") {
            let result;
            if (values) result = inventoryDBSQLLITE.prepare(sql).run(values);
            else result = db.prepare(sql).run();
            if (Array.isArray(result)) return result as T[];
            return [result] as T[];
        }
        return (await inventoryDB.query(sql, values))[0] as T[];
    } catch (err) {
        throw {
            date: new Date(),
            errorMSG: err,
            code: ErrorCodes.sqlError
        } as IError
    }
}

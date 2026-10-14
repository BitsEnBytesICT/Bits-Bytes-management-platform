import { inventoryDBQuery } from "../src/common/db";

//we moeten hier een table per category maken, dat komt™

const upStatements: string[] = [
    `
    CREATE TABLE IF NOT EXISTS Categories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        description TEXT NULL
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS Items (
        id INTEGER PRIMARY KEY,
        category TEXT NOT NULL,
        categoryId INTEGER NOT NULL,
        description TEXT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        serialNumber TEXT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY(categoryId) REFERENCES Categories(id)
    )
    `,
    "CREATE INDEX IF NOT EXISTS idx_items_category ON Items(categoryId)",
];

const downStatements: string[] = [
    "DROP INDEX IF EXISTS idx_items_category",
    "DROP TABLE IF EXISTS Items",
    "DROP TABLE IF EXISTS Categories",
];

export async function up(): Promise<void> {
    for (const statement of upStatements) {
        await inventoryDBQuery(statement);
    }
}

export async function down(): Promise<void> {
    for (const statement of downStatements) {
        await inventoryDBQuery(statement);
    }
}

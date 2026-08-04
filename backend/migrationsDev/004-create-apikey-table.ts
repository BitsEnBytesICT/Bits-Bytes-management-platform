import { dbQuery } from "../src/common/db";

export async function up(): Promise<void> {
    await dbQuery(`
        CREATE TABLE IF NOT EXISTS ApiKeys (
            id INTEGER PRIMARY KEY,
            apikey TEXT NOT NULL UNIQUE,
            permissionId INTEGER NOT NULL,
            FOREIGN KEY(permissionId) REFERENCES Permissions(id)
        )
    `);
}

export async function down(): Promise<void> {
    await dbQuery("DROP TABLE IF EXISTS ApiKeys");
}
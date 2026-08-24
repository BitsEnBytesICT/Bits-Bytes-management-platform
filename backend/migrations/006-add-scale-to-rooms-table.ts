import { dbQuery } from "../src/common/db";

export async function up(): Promise<void> {
    await dbQuery(`
        ALTER TABLE Rooms
        ADD COLUMN scale DOUBLE NOT NULL
    `);
}

export async function down(): Promise<void> {
    await dbQuery(`
        ALTER TABLE Rooms
        DROP COLUMN scale
    `);
}

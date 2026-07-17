import { dbQuery } from "../src/common/db";

export async function up(): Promise<void> {
    await dbQuery(`
        ALTER TABLE Participants
        CHANGE COLUMN product financing VARCHAR(255) NULL
    `);
}

export async function down(): Promise<void> {
    await dbQuery(`
        ALTER TABLE Participants
        CHANGE COLUMN financing product VARCHAR(255) NULL
    `);
}
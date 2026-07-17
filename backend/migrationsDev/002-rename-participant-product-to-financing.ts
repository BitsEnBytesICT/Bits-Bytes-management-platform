import { dbQuery } from "../src/common/db";

export async function up(): Promise<void> { 
    await dbQuery(`
        ALTER TABLE Participants RENAME COLUMN product TO financing
    `); 
}

export async function down(): Promise<void> { 
    await dbQuery(`
        ALTER TABLE Participants RENAME COLUMN financing TO product
    `); 
}
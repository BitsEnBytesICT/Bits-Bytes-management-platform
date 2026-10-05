import { dbQuery } from "../src/common/db";

export async function up(): Promise<void> {
    await dbQuery("ALTER TABLE Accounts ADD COLUMN calendars TEXT NULL");
}

export async function down(): Promise<void> {
    await dbQuery("ALTER TABLE Accounts DROP COLUMN calendars");
}

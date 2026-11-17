import { dbQuery } from "../src/common/db";

export async function up(): Promise<void> {
    await dbQuery("ALTER TABLE Participants ADD COLUMN bday VARCHAR(255) NULL");
    await dbQuery("ALTER TABLE Participants ADD COLUMN prefix VARCHAR(255) NULL");
    await dbQuery("ALTER TABLE Accounts ADD COLUMN prefix VARCHAR(255) NULL");
}

export async function down(): Promise<void> {
    await dbQuery("ALTER TABLE Participants DROP COLUMN bday");
    await dbQuery("ALTER TABLE Participants DROP COLUMN prefix");
    await dbQuery("ALTER TABLE Accounts DROP COLUMN prefix");
}

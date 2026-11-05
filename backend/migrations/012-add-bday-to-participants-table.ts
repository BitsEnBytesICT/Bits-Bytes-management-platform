import { dbQuery } from "../src/common/db";

export async function up(): Promise<void> {
    await dbQuery("ALTER TABLE Participants ADD COLUMN bday VARCHAR(255) NULL");
}

export async function down(): Promise<void> {
    await dbQuery("ALTER TABLE Participants DROP COLUMN bday");
}

import { dbQuery } from "../src/common/db";

export async function up(): Promise<void> {
    await dbQuery("ALTER TABLE Accounts ADD COLUMN shortcuts JSON NULL");
}

export async function down(): Promise<void> {
    await dbQuery("ALTER TABLE Accounts DROP COLUMN shortcuts");
}

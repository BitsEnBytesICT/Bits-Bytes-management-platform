import { dbQuery } from "../src/common/db";

export async function up(): Promise<void> {
    await dbQuery("ALTER TABLE Workplaces MODIFY COLUMN extraInfo TEXT NULL");
}

export async function down(): Promise<void> {
    await dbQuery("ALTER TABLE Workplaces MODIFY COLUMN extraInfo BLOB NULL");
}

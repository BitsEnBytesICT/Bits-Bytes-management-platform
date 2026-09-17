import { dbGet, dbQuery } from "../src/common/db";

async function changeExtraInfoType(type: "TEXT" | "BLOB"): Promise<void> {
    const [foreignKeys] = await dbGet<{ foreign_keys: number }>("PRAGMA foreign_keys");
    await dbQuery("PRAGMA foreign_keys = OFF");

    try {
        await dbQuery("BEGIN TRANSACTION");

        try {
            await dbQuery(`
                CREATE TABLE Workplaces_new (
                    id INTEGER PRIMARY KEY,
                    xpos INTEGER NOT NULL,
                    ypos INTEGER NOT NULL,
                    RoomID INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    extraInfo ${type},
                    rotation INTEGER NULL,
                    FOREIGN KEY(RoomID) REFERENCES Rooms(id)
                )
            `);
            await dbQuery(`
                INSERT INTO Workplaces_new (id, xpos, ypos, RoomID, name, extraInfo, rotation)
                SELECT id, xpos, ypos, RoomID, name, CAST(extraInfo AS ${type}), rotation
                FROM Workplaces
            `);
            await dbQuery("DROP TABLE Workplaces");
            await dbQuery("ALTER TABLE Workplaces_new RENAME TO Workplaces");
            await dbQuery("COMMIT");
        } catch (error) {
            await dbQuery("ROLLBACK");
            throw error;
        }
    } finally {
        await dbQuery(`PRAGMA foreign_keys = ${foreignKeys?.foreign_keys ? "ON" : "OFF"}`);
    }
}

export async function up(): Promise<void> {
    await changeExtraInfoType("TEXT");
}

export async function down(): Promise<void> {
    await changeExtraInfoType("BLOB");
}

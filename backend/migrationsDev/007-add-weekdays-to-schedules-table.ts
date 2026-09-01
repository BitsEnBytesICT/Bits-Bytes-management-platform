import { dbQuery } from "../src/common/db";

const upStatements: string[] = [
    `
    CREATE TABLE Schedules_new (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT,
        mon INTEGER NULL,
        thues INTEGER NULL,
        wed INTEGER NULL,
        thurs INTEGER NULL,
        fri INTEGER NULL,
        FOREIGN KEY(mon) REFERENCES Workplaces(id),
        FOREIGN KEY(thues) REFERENCES Workplaces(id),
        FOREIGN KEY(wed) REFERENCES Workplaces(id),
        FOREIGN KEY(thurs) REFERENCES Workplaces(id),
        FOREIGN KEY(fri) REFERENCES Workplaces(id)
    )
    `,
    `
    INSERT INTO Schedules_new (id, name, startDate, endDate)
    SELECT id, name, startDate, endDate
    FROM Schedules
    `,
    "DROP TABLE Schedules",
    "ALTER TABLE Schedules_new RENAME TO Schedules",
];

const downStatements: string[] = [
    `
    CREATE TABLE Schedules_new (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT
    )
    `,
    `
    INSERT INTO Schedules_new (id, name, startDate, endDate)
    SELECT id, name, startDate, endDate
    FROM Schedules
    `,
    "DROP TABLE Schedules",
    "ALTER TABLE Schedules_new RENAME TO Schedules",
];

async function rebuildSchedules(statements: string[]): Promise<void> {
    await dbQuery("PRAGMA foreign_keys = OFF");

    try {
        await dbQuery("BEGIN TRANSACTION");

        try {
            for (const statement of statements) {
                await dbQuery(statement);
            }

            await dbQuery("COMMIT");
        } catch (error) {
            await dbQuery("ROLLBACK");
            throw error;
        }
    } finally {
        await dbQuery("PRAGMA foreign_keys = ON");
    }
}

export async function up(): Promise<void> {
    await rebuildSchedules(upStatements);
}

export async function down(): Promise<void> {
    await rebuildSchedules(downStatements);
}

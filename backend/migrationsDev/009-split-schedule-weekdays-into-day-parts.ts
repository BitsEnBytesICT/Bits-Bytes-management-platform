import { dbGet, dbQuery } from "../src/common/db";

const upStatements: string[] = [
    `
    CREATE TABLE Schedules_new (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT,
        participant INTEGER NOT NULL,
        monMorning INTEGER NULL,
        monEvening INTEGER NULL,
        thuesMorning INTEGER NULL,
        thuesEvening INTEGER NULL,
        wedMorning INTEGER NULL,
        wedEvening INTEGER NULL,
        thursMorning INTEGER NULL,
        thursEvening INTEGER NULL,
        friMorning INTEGER NULL,
        friEvening INTEGER NULL,
        FOREIGN KEY(participant) REFERENCES Participants(id),
        FOREIGN KEY(monMorning) REFERENCES Workplaces(id),
        FOREIGN KEY(monEvening) REFERENCES Workplaces(id),
        FOREIGN KEY(thuesMorning) REFERENCES Workplaces(id),
        FOREIGN KEY(thuesEvening) REFERENCES Workplaces(id),
        FOREIGN KEY(wedMorning) REFERENCES Workplaces(id),
        FOREIGN KEY(wedEvening) REFERENCES Workplaces(id),
        FOREIGN KEY(thursMorning) REFERENCES Workplaces(id),
        FOREIGN KEY(thursEvening) REFERENCES Workplaces(id),
        FOREIGN KEY(friMorning) REFERENCES Workplaces(id),
        FOREIGN KEY(friEvening) REFERENCES Workplaces(id)
    )
    `,
    // Existing assignments cover the whole day, so preserve them in both day parts.
    `
    INSERT INTO Schedules_new (
        id, name, startDate, endDate, participant,
        monMorning, monEvening,
        thuesMorning, thuesEvening,
        wedMorning, wedEvening,
        thursMorning, thursEvening,
        friMorning, friEvening
    )
    SELECT
        id, name, startDate, endDate,
        (
            SELECT DISTINCT participantId
            FROM SchedulesParticipants
            WHERE scheduleId = Schedules.id
        ),
        mon, mon,
        thues, thues,
        wed, wed,
        thurs, thurs,
        fri, fri
    FROM Schedules
    `,
    "DROP TABLE SchedulesParticipants",
    "DROP TABLE Schedules",
    "ALTER TABLE Schedules_new RENAME TO Schedules",
    "CREATE INDEX idx_schedules_participant ON Schedules(participant)",
];

const downStatements: string[] = [
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
    // The old schema can only keep one workplace per day; prefer morning, then evening.
    `
    INSERT INTO Schedules_new (id, name, startDate, endDate, mon, thues, wed, thurs, fri)
    SELECT
        id, name, startDate, endDate,
        COALESCE(monMorning, monEvening),
        COALESCE(thuesMorning, thuesEvening),
        COALESCE(wedMorning, wedEvening),
        COALESCE(thursMorning, thursEvening),
        COALESCE(friMorning, friEvening)
    FROM Schedules
    `,
    `
    CREATE TABLE SchedulesParticipants (
        id INTEGER PRIMARY KEY,
        scheduleId INTEGER NOT NULL,
        participantId INTEGER NOT NULL,
        FOREIGN KEY(scheduleId) REFERENCES Schedules(id),
        FOREIGN KEY(participantId) REFERENCES Participants(id)
    )
    `,
    // Restore participant links before removing the participant column.
    `
    INSERT INTO SchedulesParticipants (scheduleId, participantId)
    SELECT id, participant
    FROM Schedules
    WHERE participant IS NOT NULL
    `,
    "DROP TABLE Schedules",
    "ALTER TABLE Schedules_new RENAME TO Schedules",
];

async function rebuildSchedules(statements: string[]): Promise<void> {
    const [foreignKeys] = await dbGet<{ foreign_keys: number }>("PRAGMA foreign_keys");
    await dbQuery("PRAGMA foreign_keys = OFF");

    try {
        await dbQuery("BEGIN TRANSACTION");

        try {
            for (const statement of statements) {
                await dbQuery(statement);
            }

            const [violation] = await dbGet("PRAGMA foreign_key_check");
            if (violation) {
                throw new Error("Schedules migration would create an invalid foreign key reference");
            }

            await dbQuery("COMMIT");
        } catch (error) {
            await dbQuery("ROLLBACK");
            throw error;
        }
    } finally {
        await dbQuery(foreignKeys?.foreign_keys ? "PRAGMA foreign_keys = ON" : "PRAGMA foreign_keys = OFF");
    }
}

export async function up(): Promise<void> {
    // A single participant column cannot preserve links to multiple participants.
    const [sharedSchedule] = await dbGet<{ scheduleId: number }>(`
        SELECT scheduleId
        FROM SchedulesParticipants
        GROUP BY scheduleId
        HAVING COUNT(DISTINCT participantId) > 1
        LIMIT 1
    `);
    if (sharedSchedule) {
        throw new Error(`Cannot migrate schedule ${sharedSchedule.scheduleId}: it is linked to multiple participants`);
    }

    await rebuildSchedules(upStatements);
}

export async function down(): Promise<void> {
    await rebuildSchedules(downStatements);
}

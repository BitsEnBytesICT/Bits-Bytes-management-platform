import { dbQuery } from "../src/common/db";

const upStatements: string[] = [
    `
    CREATE TABLE IF NOT EXISTS Permissions (
        id INTEGER PRIMARY KEY,
        role TEXT UNIQUE NOT NULL,
        permissions TEXT NOT NULL
        )
    `,

    `
    CREATE TABLE IF NOT EXISTS Accounts (
        id INTEGER PRIMARY KEY,
        type TEXT NOT NULL,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL,
        password TEXT NOT NULL,
        FOREIGN KEY(role) REFERENCES Permissions(role)
        )
    `,

    `
    CREATE TABLE IF NOT EXISTS Participants (
        id INTEGER PRIMARY KEY,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        organisation TEXT NOT NULL,
        account INTEGER NOT NULL,
        rfid TEXT NOT NULL UNIQUE,
        createdAt TEXT NOT NULL,
        active INTEGER NOT NULL,
        clockedin INTEGER,
        product TEXT,
        FOREIGN KEY(account) REFERENCES Accounts(id)
        )
    `,

    `
    CREATE TABLE IF NOT EXISTS Signatures (
        id INTEGER PRIMARY KEY,
        participantID INTEGER NOT NULL,
        date TEXT NOT NULL,
        signature TEXT NOT NULL,
        FOREIGN KEY(participantID) REFERENCES Participants(id)
        )
    `,

    `
    CREATE TABLE IF NOT EXISTS Attendances (
        id INTEGER PRIMARY KEY,
        participantID INTEGER NOT NULL,
        clockinDate TEXT NOT NULL,
        clockoutDate TEXT,
        workDuration INTEGER,
        FOREIGN KEY(participantID) REFERENCES Participants(id)
        )
    `,
    `CREATE UNIQUE INDEX unique_one_null_clockout
        ON Attendances(participantID)
        WHERE clockoutDate IS NULL;`,

    `
    CREATE TABLE IF NOT EXISTS Rooms (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        width INTEGER NOT NULL,
        height INTEGER NOT NULL
        )
    `,

    `
    CREATE TABLE IF NOT EXISTS Workplaces (
        id INTEGER PRIMARY KEY,
        xpos INTEGER NOT NULL,
        ypos INTEGER NOT NULL,
        RoomID INTEGER NOT NULL,
        name TEXT NOT NULL,
        extraInfo BLOB,
        FOREIGN KEY(RoomID) REFERENCES Rooms(id)
        )
    `,

    `
    CREATE TABLE IF NOT EXISTS Schedules (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT
        )
    `,

    `
    CREATE TABLE IF NOT EXISTS SchedulesParticipants (
        id INTEGER PRIMARY KEY,
        scheduleId INTEGER NOT NULL,
        participantId INTEGER NOT NULL,
        FOREIGN KEY(scheduleId) REFERENCES Schedules(id),
        FOREIGN KEY(participantId) REFERENCES Participants(id)
        )
    `
];

const downStatements: string[] = [
    "DROP TABLE IF EXISTS SchedulesParticipants",
    "DROP TABLE IF EXISTS Workplaces",
    "DROP TABLE IF EXISTS Attendances",
    "DROP TABLE IF EXISTS Signatures",
    "DROP TABLE IF EXISTS Schedules",
    "DROP TABLE IF EXISTS Rooms",
    "DROP TABLE IF EXISTS Participants",
    "DROP TABLE IF EXISTS Accounts",
    "DROP TABLE IF EXISTS Permissions",
];

export async function up(): Promise<void> {
    for (const statement of upStatements) {
        await dbQuery(statement);
    }
}

export async function down(): Promise<void> {
    for (const statement of downStatements) {
        await dbQuery(statement);
    }
}
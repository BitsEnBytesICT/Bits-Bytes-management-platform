import { dbQuery } from "../src/common/db";

const upStatements: string[] = [
    `
    ALTER TABLE Rooms
    ADD COLUMN scale REAL NOT NULL
    `,
    `
    ALTER TABLE Rooms
    ADD COLUMN rotation INTEGER NULL
    `,
    `
    CREATE TABLE Walls (
        id INTEGER PRIMARY KEY,
        xpos INTEGER NOT NULL,
        ypos INTEGER NOT NULL,
        height INTEGER NOT NULL,
        RoomID INTEGER NOT NULL,
        rotation INTEGER NULL,
        FOREIGN KEY(RoomID) REFERENCES Rooms(id)
    )
    `,
    `
    ALTER TABLE Workplaces
    ADD COLUMN rotation INTEGER NULL
    `,
];

const downStatements: string[] = [
    `
    ALTER TABLE Workplaces
    DROP COLUMN rotation
    `,
    "DROP TABLE Walls",
    `
    ALTER TABLE Rooms
    DROP COLUMN rotation
    `,
    `
    ALTER TABLE Rooms
    DROP COLUMN scale
    `,
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

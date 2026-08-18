import { dbQuery } from "../src/common/db";

const upStatements: string[] = [
    `
    ALTER TABLE Attendances
    ADD COLUMN signature TEXT NOT NULL
    `,
    "DROP TABLE IF EXISTS Signatures",
];

const downStatements: string[] = [
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
    ALTER TABLE Attendances
    DROP COLUMN signature
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

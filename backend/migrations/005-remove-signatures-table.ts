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
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        participantID INT UNSIGNED NOT NULL,
        date DATETIME(3) NOT NULL,
        signature TEXT NOT NULL,
        PRIMARY KEY (id),
        KEY idx_signatures_participant (participantID),
        CONSTRAINT fk_signatures_participant
            FOREIGN KEY (participantID)
            REFERENCES Participants(id)
    ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
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

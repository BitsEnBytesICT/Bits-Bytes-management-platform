import { dbQuery } from "../src/common/db";

const upStatements: string[] = [
    `
    ALTER TABLE Accounts
    ADD UNIQUE KEY uq_accounts_firstname_lastname (firstname, lastname),
    ADD UNIQUE KEY uq_accounts_username (username)
    `,
    `
    ALTER TABLE Participants
    ADD UNIQUE KEY uq_participants_firstname_lastname (firstname, lastname)
    `,
];

const downStatements: string[] = [
    "ALTER TABLE Participants DROP INDEX uq_participants_firstname_lastname",
    "ALTER TABLE Accounts DROP INDEX uq_accounts_username, DROP INDEX uq_accounts_firstname_lastname",
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

import { dbQuery } from "../src/common/db";

const upStatements: string[] = [
    `
    CREATE UNIQUE INDEX uq_accounts_firstname_lastname
    ON Accounts(firstname, lastname)
    `,
    `
    CREATE UNIQUE INDEX uq_participants_firstname_lastname
    ON Participants(firstname, lastname)
    `,
];

const downStatements: string[] = [
    "DROP INDEX uq_participants_firstname_lastname",
    "DROP INDEX uq_accounts_firstname_lastname",
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

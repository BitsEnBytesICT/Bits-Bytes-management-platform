import { dbQuery } from "../src/common/db";

const upStatements: string[] = [
    `
    ALTER TABLE Schedules
    ADD COLUMN mon INT UNSIGNED NULL,
    ADD KEY idx_schedules_mon_workplace (mon),
    ADD CONSTRAINT fk_schedules_mon_workplace
        FOREIGN KEY (mon)
        REFERENCES Workplaces(id)
    `,
    `
    ALTER TABLE Schedules
    ADD COLUMN thues INT UNSIGNED NULL,
    ADD KEY idx_schedules_thues_workplace (thues),
    ADD CONSTRAINT fk_schedules_thues_workplace
        FOREIGN KEY (thues)
        REFERENCES Workplaces(id)
    `,
    `
    ALTER TABLE Schedules
    ADD COLUMN wed INT UNSIGNED NULL,
    ADD KEY idx_schedules_wed_workplace (wed),
    ADD CONSTRAINT fk_schedules_wed_workplace
        FOREIGN KEY (wed)
        REFERENCES Workplaces(id)
    `,
    `
    ALTER TABLE Schedules
    ADD COLUMN thurs INT UNSIGNED NULL,
    ADD KEY idx_schedules_thurs_workplace (thurs),
    ADD CONSTRAINT fk_schedules_thurs_workplace
        FOREIGN KEY (thurs)
        REFERENCES Workplaces(id)
    `,
    `
    ALTER TABLE Schedules
    ADD COLUMN fri INT UNSIGNED NULL,
    ADD KEY idx_schedules_fri_workplace (fri),
    ADD CONSTRAINT fk_schedules_fri_workplace
        FOREIGN KEY (fri)
        REFERENCES Workplaces(id)
    `,
];

const downStatements: string[] = [
    `
    ALTER TABLE Schedules
    DROP FOREIGN KEY fk_schedules_fri_workplace,
    DROP INDEX idx_schedules_fri_workplace,
    DROP COLUMN fri
    `,
    `
    ALTER TABLE Schedules
    DROP FOREIGN KEY fk_schedules_thurs_workplace,
    DROP INDEX idx_schedules_thurs_workplace,
    DROP COLUMN thurs
    `,
    `
    ALTER TABLE Schedules
    DROP FOREIGN KEY fk_schedules_wed_workplace,
    DROP INDEX idx_schedules_wed_workplace,
    DROP COLUMN wed
    `,
    `
    ALTER TABLE Schedules
    DROP FOREIGN KEY fk_schedules_thues_workplace,
    DROP INDEX idx_schedules_thues_workplace,
    DROP COLUMN thues
    `,
    `
    ALTER TABLE Schedules
    DROP FOREIGN KEY fk_schedules_mon_workplace,
    DROP INDEX idx_schedules_mon_workplace,
    DROP COLUMN mon
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

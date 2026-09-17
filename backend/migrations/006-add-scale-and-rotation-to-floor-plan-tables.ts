import { dbQuery } from "../src/common/db";

const upStatements: string[] = [
    `
    ALTER TABLE Rooms
    ADD COLUMN scale DOUBLE NOT NULL
    `,
    `
    ALTER TABLE Rooms
    ADD COLUMN rotation INT NULL
    `,
    `
    CREATE TABLE Walls (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        xpos INT NOT NULL,
        ypos INT NOT NULL,
        height INT NOT NULL,
        RoomID INT UNSIGNED NOT NULL,
        rotation INT NULL,
        PRIMARY KEY (id),
        KEY idx_walls_room (RoomID),
        CONSTRAINT fk_walls_room
            FOREIGN KEY (RoomID)
            REFERENCES Rooms(id)
    ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `,
    `
    ALTER TABLE Workplaces
    ADD COLUMN rotation INT NULL
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

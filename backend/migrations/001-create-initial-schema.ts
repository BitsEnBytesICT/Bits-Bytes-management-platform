import { dbQuery } from "../src/common/db";

const upStatements: string[] = [
    `
    CREATE TABLE IF NOT EXISTS Permissions (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        role VARCHAR(100) NOT NULL,
        permissions TEXT NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY uq_permissions_role (role)
    ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `,

    `
    CREATE TABLE IF NOT EXISTS Accounts (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        type VARCHAR(100) NOT NULL,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        PRIMARY KEY (id),
        KEY idx_accounts_role (role),
        CONSTRAINT fk_accounts_permission_role
            FOREIGN KEY (role)
            REFERENCES Permissions(role)
    ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `,

    `
    CREATE TABLE IF NOT EXISTS Deelnemers (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        organisation VARCHAR(255) NOT NULL,
        account INT UNSIGNED NOT NULL,
        rfid VARCHAR(255) NOT NULL,
        createdAt DATETIME(3) NOT NULL,
        active INT NOT NULL,
        clockedin INT NULL,
        product VARCHAR(255) NULL,
        PRIMARY KEY (id),
        UNIQUE KEY uq_deelnemers_rfid (rfid),
        KEY idx_deelnemers_account (account),
        CONSTRAINT fk_deelnemers_account
            FOREIGN KEY (account)
            REFERENCES Accounts(id)
    ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `,

    `
    CREATE TABLE IF NOT EXISTS Signatures (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        deelnemerID INT UNSIGNED NOT NULL,
        date DATETIME(3) NOT NULL,
        signature TEXT NOT NULL,
        PRIMARY KEY (id),
        KEY idx_signatures_deelnemer (deelnemerID),
        CONSTRAINT fk_signatures_deelnemer
            FOREIGN KEY (deelnemerID)
            REFERENCES Deelnemers(id)
    ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `,

    `
    CREATE TABLE IF NOT EXISTS Attendances (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        deelnemerID INT UNSIGNED NOT NULL,
        clockinDate DATETIME(3) NOT NULL,
        clockoutDate DATETIME(3) NULL,
        workDuration INT NULL,

        PRIMARY KEY (id),
        KEY idx_attendances_deelnemer (deelnemerID),

        UNIQUE KEY unique_one_null_clockout (
            (IF(clockoutDate IS NULL, deelnemerID, NULL))
        ),

        CONSTRAINT fk_attendances_deelnemer
            FOREIGN KEY (deelnemerID)
            REFERENCES Deelnemers(id)
    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4
    COLLATE=utf8mb4_unicode_ci;
    `,

    `
    CREATE TABLE IF NOT EXISTS Rooms (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        width INT NOT NULL,
        height INT NOT NULL,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `,

    `
    CREATE TABLE IF NOT EXISTS Workplaces (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        xpos INT NOT NULL,
        ypos INT NOT NULL,
        RoomID INT UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        extraInfo BLOB NULL,
        PRIMARY KEY (id),
        KEY idx_workplaces_room (RoomID),
        CONSTRAINT fk_workplaces_room
            FOREIGN KEY (RoomID)
            REFERENCES Rooms(id)
    ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `,

    `
    CREATE TABLE IF NOT EXISTS Scedules (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        startDate DATETIME(3) NOT NULL,
        endDate DATETIME(3) NULL,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `,

    `
    CREATE TABLE IF NOT EXISTS ScedulesDeelnemers (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        sceduleId INT UNSIGNED NOT NULL,
        deelnemerId INT UNSIGNED NOT NULL,
        PRIMARY KEY (id),
        KEY idx_scedules_deelnemers_scedule (sceduleId),
        KEY idx_scedules_deelnemers_deelnemer (deelnemerId),
        CONSTRAINT fk_scedules_deelnemers_scedule
            FOREIGN KEY (sceduleId)
            REFERENCES Scedules(id),
        CONSTRAINT fk_scedules_deelnemers_deelnemer
            FOREIGN KEY (deelnemerId)
            REFERENCES Deelnemers(id)
    ) ENGINE=InnoDB
      DEFAULT CHARSET=utf8mb4
      COLLATE=utf8mb4_unicode_ci
    `,
];

const downStatements: string[] = [
    "DROP TABLE IF EXISTS ScedulesDeelnemers",
    "DROP TABLE IF EXISTS Workplaces",
    "DROP TABLE IF EXISTS Attendances",
    "DROP TABLE IF EXISTS Signatures",
    "DROP TABLE IF EXISTS Scedules",
    "DROP TABLE IF EXISTS Rooms",
    "DROP TABLE IF EXISTS Deelnemers",
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

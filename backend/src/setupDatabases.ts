import Database from 'better-sqlite3';

export const setupDatabase = () => {
    const db = new Database('database.db', { verbose: console.log });
    db.pragma('foreign_keys = OFF');

    const inventoryDB = new Database('inventoryDatabase.db', { verbose: console.log });

    db.prepare(`DROP TABLE IF EXISTS Permissions`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS Permissions (
        id INTEGER PRIMARY KEY,
        role TEXT UNIQUE NOT NULL,
        permissions TEXT NOT NULL
        )`
    ).run();

    db.prepare(`DROP TABLE IF EXISTS Accounts`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS Accounts (
        id INTEGER PRIMARY KEY,
        type TEXT NOT NULL,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        role TEXT NOT NULL,
        password TEXT NOT NULL,
        FOREIGN KEY(role) REFERENCES Permissions(role)
        )`
    ).run();

    db.prepare(`DROP TABLE IF EXISTS Participants`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS Participants (
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
        )`
    ).run();

    db.prepare(`DROP TABLE IF EXISTS Signatures`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS Signatures (
        id INTEGER PRIMARY KEY,
        participantID INTEGER NOT NULL,
        date TEXT NOT NULL,
        signature TEXT NOT NULL,
        FOREIGN KEY(participantID) REFERENCES Participants(id)
        )`
    ).run();

    db.prepare(`DROP TABLE IF EXISTS Attendances`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS Attendances (
        id INTEGER PRIMARY KEY,
        participantID INTEGER NOT NULL,
        clockinDate TEXT NOT NULL,
        clockoutDate TEXT,
        workDuration INTEGER,
        FOREIGN KEY(participantID) REFERENCES Participants(id)
        )`
    ).run();

    db.prepare(`CREATE UNIQUE INDEX unique_one_null_clockout
        ON Attendances(participantID)
        WHERE clockoutDate IS NULL;`).run();

    db.prepare(`DROP TABLE IF EXISTS Rooms`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS Rooms (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        width INTEGER NOT NULL,
        height INTEGER NOT NULL
        )`
    ).run();

    db.prepare(`DROP TABLE IF EXISTS Workplaces`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS Workplaces (
        id INTEGER PRIMARY KEY,
        xpos INTEGER NOT NULL,
        ypos INTEGER NOT NULL,
        RoomID INTEGER NOT NULL,
        name TEXT NOT NULL,
        extraInfo BLOB,
        FOREIGN KEY(RoomID) REFERENCES Rooms(id)
        )`
    ).run();

    db.prepare(`DROP TABLE IF EXISTS Schedules`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS Schedules (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT
        )`
    ).run();

    db.prepare(`DROP TABLE IF EXISTS SchedulesParticipants`).run();
    db.prepare(`CREATE TABLE IF NOT EXISTS SchedulesParticipants (
        id INTEGER PRIMARY KEY,
        scheduleId INTEGER NOT NULL,
        participantId INTEGER NOT NULL,
        FOREIGN KEY(scheduleId) REFERENCES Schedules(id),
        FOREIGN KEY(participantId) REFERENCES Participants(id)
        )`
    ).run();

    inventoryDB.prepare(`DROP TABLE IF EXISTS Categories`).run();
    inventoryDB.prepare(`CREATE TABLE IF NOT EXISTS Categories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
        )`
    ).run();

    db.pragma('foreign_keys = ON');

    db.prepare("INSERT INTO Permissions (role, permissions) VALUES (?, ?)").run('admin', 'all');
    db.prepare("INSERT INTO Permissions (role, permissions) VALUES (?, ?)").run('support', 'clockin');

    db.prepare("INSERT INTO Accounts (type, firstname, lastname, role, password) VALUES (?, ?, ?, ?, ?)").run('superAdmin', 'Systeem', 'Admin', 'admin', 'changeme');

    const now = new Date().toISOString();
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, product) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Jan', 'de Vries', 'IT Afdeling', 1, '11F3EF12', now, 1, 0, 'Develop');
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, product) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Maria', 'Jansen', 'HR', 1, '4D6108F9', now, 1, 1, 'Zorg');
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, product) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Peter', 'Bakker', 'Facilitair', 1, '98765432', now, 1, 0, 'Dagbesteding');

    console.log('Seed data inserted');
}
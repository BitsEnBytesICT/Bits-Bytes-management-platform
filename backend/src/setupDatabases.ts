import Database from 'better-sqlite3';
import { encrypt } from './common/encryptorDecryptor';

export const setupDatabase = () => {
    const db = new Database('database.db', { verbose: console.log });
    db.pragma('foreign_keys = ON');

    db.prepare("INSERT INTO Permissions (role, permissions) VALUES (?, ?)").run('admin', 'all');
    db.prepare("INSERT INTO Permissions (role, permissions) VALUES (?, ?)").run('support', 'clockin');

    db.prepare("INSERT INTO Accounts (type, firstname, lastname, role, password) VALUES (?, ?, ?, ?, ?)").run('superAdmin', 'Systeem', 'Admin', 'admin', encrypt('changeme'));

    const now = new Date().toISOString();
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, product) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Jan', 'de Vries', 'IT Afdeling', 1, '11F3EF12', now, 1, 0, 'Develop');
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, product) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Maria', 'Jansen', 'HR', 1, '4D6108F9', now, 1, 1, 'Zorg');
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, product) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Peter', 'Bakker', 'Facilitair', 1, '98765432', now, 1, 0, 'Dagbesteding');

    console.log('Seed data inserted');
}
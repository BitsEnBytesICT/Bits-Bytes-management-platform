import Database from 'better-sqlite3';
import { encrypt } from './common/encryptorDecryptor';
import { getCurrentDate } from './common/dateFunctions';

export const setupDatabase = () => {
    const db = new Database('database.db', { verbose: console.log });
    try {
        db.prepare('DELETE FROM Participants WHERE id > ?').run(-1);
        db.prepare('DELETE FROM Accounts WHERE id > ?').run(-1);
        db.prepare('DELETE FROM ApiKeys WHERE id > ?').run(-1);
        db.prepare('DELETE FROM Permissions WHERE id > ?').run(-1);

        db.pragma('foreign_keys = ON');

        db.prepare("INSERT INTO Permissions (role, permissions) VALUES (?, ?)").run('admin', '*');
        db.prepare("INSERT INTO ApiKeys (apikey, permissionId) VALUES (?, ?)").run('test-api-key', 1);

        db.prepare("INSERT INTO Accounts (type, firstname, username, lastname, role, password) VALUES (?, ?, ?, ?, ?, ?)").run('support', 'support', 'support', 'support', 'admin', encrypt('test123'));
        db.prepare("INSERT INTO Accounts (type, firstname, username, lastname, role, password) VALUES (?, ?, ?, ?, ?, ?)").run('it', 'it', 'it', 'it', 'admin', encrypt('test123'));
        db.prepare("INSERT INTO Accounts (type, firstname, username, lastname, role, password) VALUES (?, ?, ?, ?, ?, ?)").run('participant', 'Jan', 'JanD', 'de Vries', 'admin', encrypt('test123'));
        db.prepare("INSERT INTO Accounts (type, firstname, username, lastname, role, password) VALUES (?, ?, ?, ?, ?, ?)").run('participant', 'Maria', 'MariaJ', 'Jansen', 'admin', encrypt('test123'));
        db.prepare("INSERT INTO Accounts (type, firstname, username, lastname, role, password) VALUES (?, ?, ?, ?, ?, ?)").run('participant', 'Peter', 'PeterB', 'Bakker', 'admin', encrypt('test123'));

        const now = getCurrentDate();
        db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, financing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Jan', 'de Vries', 'WMO', 3, '11F3EF12', now, 1, 0, 'Develop');
        db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, financing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Maria', 'Jansen', 'Orionis', 4, 'E1C7A710', now, 1, 1, 'Zorg');
        db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, financing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Peter', 'Bakker', 'Gemeente', 5, '98765432', now, 1, 0, 'Dagbesteding');
        console.log('Seed data inserted');
    } catch (error) {
        console.log(error)
    }
}

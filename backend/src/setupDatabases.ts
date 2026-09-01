import Database from 'better-sqlite3';
import { encrypt } from './common/encryptorDecryptor';
import { getCurrentDate } from './common/dateFunctions';

export const setupDatabase = () => {
    const db = new Database('database.db', { verbose: console.log });
    try {
        db.prepare('DELETE FROM Walls WHERE id > ?').run(-1);
        db.prepare('DELETE FROM Workplaces WHERE id > ?').run(-1);
        db.prepare('DELETE FROM Rooms WHERE id > ?').run(-1);
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

        const roomResult = db.prepare("INSERT INTO Rooms (name, width, height, scale) VALUES (?, ?, ?, ?)").run('Gymzaal', 21000, 7000, 16);
        const roomId = Number(roomResult.lastInsertRowid);

        const insertWall = db.prepare("INSERT INTO Walls (xpos, ypos, RoomID, height, rotation) VALUES (?, ?, ?, ?, ?)");
        insertWall.run(10, 3000, roomId, 5000, null);
        insertWall.run(5000, 10, roomId, 7000, 90);

        const workplaces = [
            { xpos: 10000, ypos: 200, name: 'a1', extraInfo: 'test info' },
            { xpos: 10900, ypos: 200, name: 'a2', extraInfo: 'test info' },
            { xpos: 13400, ypos: 200, name: 'a3', extraInfo: 'test info' },
            { xpos: 14300, ypos: 200, name: 'a4', extraInfo: 'test info' },
            { xpos: 16800, ypos: 200, name: 'a5', extraInfo: 'test info' },
            { xpos: 17700, ypos: 200, name: 'a6', extraInfo: 'test info' },
            { xpos: 19200, ypos: 2700, name: 'a7', extraInfo: 'test info', rotation: 90 },
            { xpos: 19200, ypos: 3600, name: 'a8', extraInfo: 'test info', rotation: 90 },
            { xpos: 16800, ypos: 5200, name: 'a9', extraInfo: 'test info' },
            { xpos: 17700, ypos: 5200, name: 'a10', extraInfo: 'test info 2' },
            { xpos: 13400, ypos: 5200, name: 'a11', extraInfo: 'test info' },
            { xpos: 14300, ypos: 5200, name: 'a12', extraInfo: 'test info' },
            { xpos: 10000, ypos: 5200, name: 'a13', extraInfo: 'test info' },
            { xpos: 10900, ypos: 5200, name: 'a14', extraInfo: 'test info' },
            { xpos: 10000, ypos: 3500, name: 'a15', extraInfo: 'test info' },
            { xpos: 10900, ypos: 3500, name: 'a16', extraInfo: 'test info' },
            { xpos: 4000, ypos: 1200, name: 'a17', extraInfo: 'test info' },
            { xpos: 1800, ypos: 2000, name: 'a18', extraInfo: 'test info', rotation: 90 },
            { xpos: 200, ypos: 2000, name: 'a19', extraInfo: 'test info', rotation: 90 },
            { xpos: 200, ypos: 200, name: 'a20', extraInfo: 'test info', rotation: 90 },
        ];
        const insertWorkplace = db.prepare("INSERT INTO Workplaces (xpos, ypos, RoomID, name, extraInfo, rotation) VALUES (?, ?, ?, ?, ?, ?)");

        for (const workplace of workplaces) {
            insertWorkplace.run(
                workplace.xpos,
                workplace.ypos,
                roomId,
                workplace.name,
                workplace.extraInfo,
                workplace.rotation ?? null,
            );
        }

        console.log('Seed data inserted');
    } catch (error) {
        console.log(error)
    }
}

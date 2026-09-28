import Database from 'better-sqlite3';
import { encrypt } from './common/encryptorDecryptor';
import { fromDateString, getCurrentDate, toDateString } from './common/dateFunctions';
import type ISchedule from './types/schedules/ISchedule';

export const setupDatabase = () => {
    const db = new Database('database.db', { verbose: console.log });
    db.prepare('DELETE FROM Walls WHERE id > ?').run(-1);
    db.prepare('DELETE FROM Schedules WHERE id > ?').run(-1);
    db.prepare('DELETE FROM Workplaces WHERE id > ?').run(-1);
    db.prepare('DELETE FROM Rooms WHERE id > ?').run(-1);
    db.prepare('DELETE FROM Attendances WHERE id > ?').run(-1);
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
    db.prepare("INSERT INTO Accounts (type, firstname, username, lastname, role, password) VALUES (?, ?, ?, ?, ?, ?)").run('participant', 'Sophie', 'SophieV', 'Visser', 'admin', encrypt('test123'));
    db.prepare("INSERT INTO Accounts (type, firstname, username, lastname, role, password) VALUES (?, ?, ?, ?, ?, ?)").run('participant', 'Daan', 'DaanS', 'Smit', 'admin', encrypt('test123'));
    db.prepare("INSERT INTO Accounts (type, firstname, username, lastname, role, password) VALUES (?, ?, ?, ?, ?, ?)").run('participant', 'Emma', 'EmmaM', 'Meijer', 'admin', encrypt('test123'));
    db.prepare("INSERT INTO Accounts (type, firstname, username, lastname, role, password) VALUES (?, ?, ?, ?, ?, ?)").run('participant', 'Lucas', 'LucasD', 'de Boer', 'admin', encrypt('test123'));
    db.prepare("INSERT INTO Accounts (type, firstname, username, lastname, role, password) VALUES (?, ?, ?, ?, ?, ?)").run('participant', 'Noor', 'NoorM', 'Mulder', 'admin', encrypt('test123'));
    db.prepare("INSERT INTO Accounts (type, firstname, username, lastname, role, password) VALUES (?, ?, ?, ?, ?, ?)").run('participant', 'Milan', 'MilanD', 'Dekker', 'admin', encrypt('test123'));
    db.prepare("INSERT INTO Accounts (type, firstname, username, lastname, role, password) VALUES (?, ?, ?, ?, ?, ?)").run('participant', 'Lotte', 'LotteV', 'van Dijk', 'admin', encrypt('test123'));

    const now = getCurrentDate();
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, financing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Jan', 'de Vries', 'WMO', 3, '11F3EF12', now, 1, 0, 'Develop');
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, financing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Maria', 'Jansen', 'Orionis', 4, 'E1C7A710', now, 1, 1, 'Zorg');
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, financing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Peter', 'Bakker', 'Gemeente', 5, '98765432', now, 1, 0, 'Dagbesteding');
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, financing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Sophie', 'Visser', 'WMO', 6, 'A1B2C301', now, 1, 0, 'Develop');
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, financing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Daan', 'Smit', 'Orionis', 7, 'A1B2C302', now, 1, 0, 'Zorg');
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, financing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Emma', 'Meijer', 'Gemeente', 8, 'A1B2C303', now, 1, 0, 'Dagbesteding');
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, financing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Lucas', 'de Boer', 'WMO', 9, 'A1B2C304', now, 1, 0, 'Develop');
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, financing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Noor', 'Mulder', 'Orionis', 10, 'A1B2C305', now, 1, 0, 'Zorg');
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, financing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Milan', 'Dekker', 'Gemeente', 11, 'A1B2C306', now, 1, 0, 'Dagbesteding');
    db.prepare("INSERT INTO Participants (firstname, lastname, organisation, account, rfid, createdAt, active, clockedin, financing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run('Lotte', 'van Dijk', 'WMO', 12, 'A1B2C307', now, 1, 0, 'Develop');

    const roomResult = db.prepare("INSERT INTO Rooms (name, width, height, scale) VALUES (?, ?, ?, ?)").run('Gymzaal', 21000, 7000, 16);
    const roomId = Number(roomResult.lastInsertRowid);
    const quietRoomResult = db.prepare("INSERT INTO Rooms (name, width, height, scale) VALUES (?, ?, ?, ?)").run('Stilte ruimte', 7000, 7000, 16);
    const quietRoomId = Number(quietRoomResult.lastInsertRowid);

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

    const b1Id = Number(insertWorkplace.run(3500, 200, quietRoomId, 'B1', 'test info', 90).lastInsertRowid);
    const b2Id = Number(insertWorkplace.run(5200, 2650, quietRoomId, 'B2', 'test info', 90).lastInsertRowid);
    const b3Id = Number(insertWorkplace.run(3500, 2650, quietRoomId, 'B3', 'test info', 90).lastInsertRowid);
    const b4Id = Number(insertWorkplace.run(5200, 3550, quietRoomId, 'B4', 'test info', 90).lastInsertRowid);
    const b5Id = Number(insertWorkplace.run(3500, 3550, quietRoomId, 'B5', 'test info', 90).lastInsertRowid);
    const b6Id = Number(insertWorkplace.run(200, 1850, quietRoomId, 'B6', 'test info', null).lastInsertRowid);
    const b7Id = Number(insertWorkplace.run(200, 3550, quietRoomId, 'B7', 'test info', null).lastInsertRowid);

    const startDate = fromDateString(now);
    const dayOfMonth = startDate.getUTCDate();
    startDate.setUTCHours(0, 0, 0, 0);
    startDate.setUTCDate(1);
    startDate.setUTCMonth(startDate.getUTCMonth() - 1);
    const lastDayOfPreviousMonth = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() + 1, 0)).getUTCDate();
    startDate.setUTCDate(Math.min(dayOfMonth, lastDayOfPreviousMonth));
    const scheduleStartDate = toDateString(startDate);

    const schedules: Omit<ISchedule, 'startDate' | 'endDate'>[] = [
        { name: 'Jan - drie ochtenden', participant: 1, monMorning: 1, wedMorning: 1, friMorning: 1 },
        { name: 'Maria - volledige werkweek', participant: 2, monMorning: 2, monEvening: 2, thuesMorning: 3, thuesEvening: 3, wedMorning: b3Id, wedEvening: b3Id, thursMorning: 2, thursEvening: 2, friMorning: b4Id, friEvening: b4Id },
        { name: 'Peter - maandag en donderdag volledig', participant: 3, monMorning: b1Id, monEvening: b1Id, thursMorning: b1Id, thursEvening: b1Id },
        { name: 'Sophie - dinsdag- en donderdagochtend', participant: 4, thuesMorning: b2Id, thursMorning: b2Id },
        { name: 'Daan - iedere middag', participant: 5, monEvening: b2Id, thuesEvening: b3Id, wedEvening: 5, thursEvening: b5Id, friEvening: b6Id },
        { name: 'Emma - maandag, woensdag en vrijdag volledig', participant: 6, monMorning: 6, monEvening: 6, wedMorning: b4Id, wedEvening: b4Id, friMorning: 7, friEvening: 7 },
        { name: 'Lucas - dinsdag en donderdag volledig', participant: 7, thuesMorning: b5Id, thuesEvening: b5Id, thursMorning: b7Id, thursEvening: b7Id },
        { name: 'Noor - twee ochtenden en een middag', participant: 8, monMorning: b3Id, wedEvening: 8, friMorning: b2Id },
        { name: 'Milan - woensdag volledig', participant: 9, wedMorning: b6Id, wedEvening: b6Id },
        { name: 'Lotte - wisselende dagdelen', participant: 10, monEvening: b7Id, thuesMorning: 10, thursMorning: 9, thursEvening: 9, friEvening: b7Id },
    ];
    const insertSchedule = db.prepare(`
        INSERT INTO Schedules (
            name, participant, startDate, endDate,
            monMorning, monEvening, thuesMorning, thuesEvening,
            wedMorning, wedEvening, thursMorning, thursEvening,
            friMorning, friEvening
        ) VALUES (
            @name, @participant, @startDate, NULL,
            @monMorning, @monEvening, @thuesMorning, @thuesEvening,
            @wedMorning, @wedEvening, @thursMorning, @thursEvening,
            @friMorning, @friEvening
        )
    `);

    for (const schedule of schedules) {
        insertSchedule.run({
            name: schedule.name,
            participant: schedule.participant,
            startDate: scheduleStartDate,
            monMorning: schedule.monMorning ?? null,
            monEvening: schedule.monEvening ?? null,
            thuesMorning: schedule.thuesMorning ?? null,
            thuesEvening: schedule.thuesEvening ?? null,
            wedMorning: schedule.wedMorning ?? null,
            wedEvening: schedule.wedEvening ?? null,
            thursMorning: schedule.thursMorning ?? null,
            thursEvening: schedule.thursEvening ?? null,
            friMorning: schedule.friMorning ?? null,
            friEvening: schedule.friEvening ?? null,
        });
    }

    console.log('Seed data inserted');
}

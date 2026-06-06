import { dbQuery, dbGet, dbAll } from '../../common/db';
import IDeelnemer from '../../types/deelnemer';
import IAttendance from '../../types/attendance';

export default class ScanDao {

    findDeelnemerByRFID(rfid: string): IDeelnemer | undefined {
        return dbGet('SELECT * FROM Deelnemers WHERE rfid = ? AND active = 1', [rfid]) as IDeelnemer | undefined;
    }

    findOpenAttendance(deelnemerID: number): IAttendance | undefined {
        return dbGet('SELECT * FROM Attendances WHERE deelnemerID = ? AND clockoutDate IS NULL ORDER BY clockinDate DESC LIMIT 1', [deelnemerID]) as IAttendance | undefined;
    }

    createAttendance(deelnemerID: number, clockinDate: string): void {
        dbQuery('INSERT INTO Attendances (deelnemerID, clockinDate) VALUES (?, ?)', [deelnemerID, clockinDate]);
    }

    updateAttendanceClockOut(attendanceID: number, clockoutDate: string, workDuration: number): void {
        dbQuery('UPDATE Attendances SET clockoutDate = ?, workDuration = ? WHERE id = ?', [clockoutDate, workDuration, attendanceID]);
    }

    setDeelnemerClockedIn(deelnemerID: number, clockedin: number): void {
        dbQuery('UPDATE Deelnemers SET clockedin = ? WHERE id = ?', [clockedin, deelnemerID]);
    }

    getAttendanceLast30Days(deelnemerID: number): string[] {
        const rows = dbAll(
            `SELECT DISTINCT date(clockinDate) as date
             FROM Attendances
             WHERE deelnemerID = ? AND clockinDate >= date('now', '-30 days')
             ORDER BY date DESC`,
            [deelnemerID]
        ) as { date: string }[];
        return rows.map(r => r.date);
    }

    createSignature(deelnemerID: number, date: string, signature: string): void {
        dbQuery('INSERT INTO Signature (deelnemerID, date, signature) VALUES (?, ?, ?)', [deelnemerID, date, signature]);
    }
}

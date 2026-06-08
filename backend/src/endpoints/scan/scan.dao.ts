import { dbQuery, dbGet, dbAll } from '../../common/db';
import IDeelnemer from '../../types/deelnemer/IDeelnemer';
import IAttendance from '../../types/attendance/IAttendance';
import ISignature from '../../types/signature/ISignature';

export default class ScanDao {

    findDeelnemerByRFID(rfid: string): IDeelnemer | undefined {
        return dbGet('SELECT * FROM Deelnemers WHERE rfid = ? AND active = 1', [rfid]) as IDeelnemer | undefined;
    }

    findOpenAttendance(deelnemerID: number): IAttendance | undefined {
        return dbGet('SELECT * FROM Attendances WHERE deelnemerID = ? AND clockoutDate IS NULL ORDER BY clockinDate DESC LIMIT 1', [deelnemerID]) as IAttendance | undefined;
    }

    createAttendance(attendance: IAttendance): void {
        dbQuery('INSERT INTO Attendances (deelnemerID, clockinDate) VALUES (?, ?)', [attendance.deelnemerID, attendance.clockinDate]);
    }

    updateAttendanceClockOut(attendance: IAttendance): void {
        dbQuery('UPDATE Attendances SET clockoutDate = ?, workDuration = ? WHERE id = ?', [attendance.clockoutDate, attendance.workDuration, attendance.id]);
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

    createSignature(signature: ISignature): void {
        dbQuery('INSERT INTO Signatures (deelnemerID, date, signature) VALUES (?, ?, ?)', [signature.deelnemerID, signature.date, signature.signature]);
    }
}

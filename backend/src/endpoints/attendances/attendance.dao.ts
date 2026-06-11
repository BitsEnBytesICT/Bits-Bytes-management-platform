import { dbQuery, dbGet, dbAll } from '../../common/db';
import IAttendance from '../../types/attendance/IAttendance';
import daoBase from '../../common/daoBase';
import { KeyValuePair } from '../../common/Validator';

export default class AttendanceDao implements daoBase<IAttendance> {
    create(attendance: IAttendance): void {
        dbQuery('INSERT INTO Attendances (deelnemerID, clockinDate) VALUES (?, ?)', [attendance.deelnemerID, attendance.clockinDate]);
    }

    update(where: KeyValuePair<IAttendance>, ...args: KeyValuePair<IAttendance>[]): void {
        dbQuery(`UPDATE Attendances SET ${args.map(([key]) => 
            `${String(key)} = ?`).join(", ")} WHERE ${String(where[0])} = ?`, args.concat(where).map(([, value]) => value));
    }
    
    delete(...args: any[]): void {
        throw new Error('Method not implemented.');
    }
    
    list(...args: any[]): IAttendance[] {
        throw new Error('Method not implemented.');
    }
    
    findOne(...args: KeyValuePair<IAttendance>[]): IAttendance {
        return dbGet(`SELECT * FROM Attendances WHERE ${args.map(([key, value]) => 
        value === undefined ? `${String(key)} IS NULL` : `${String(key)} = ?`).join(" AND ")} LIMIT 1`, 
        args.filter(([, value]) => value !== undefined).map(([, value]) => value));
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
}
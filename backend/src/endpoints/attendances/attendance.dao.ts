import { dbQuery, dbGet, dbAll } from '../../common/db';
import IAttendance from '../../types/attendance/IAttendance';
import { KeyValuePair } from '../../common/Validator';
import { daoBase, daoBaseType } from '../../common/daoBase';

export default class AttendanceDao extends daoBase<IAttendance> implements daoBaseType<IAttendance> {
    create(attendance: IAttendance): void {
        dbQuery('INSERT INTO Attendances (deelnemerID, clockinDate) VALUES (?, ?)', [attendance.deelnemerID, attendance.clockinDate]);
    }

    update(where: KeyValuePair<IAttendance>, ...args: KeyValuePair<IAttendance>[]): void {
        this.updateFunc("Attendances", where, ...args);
    }
    
    delete(...args: any[]): void {
        throw new Error('Method not implemented.');
    }
    
    list(...args: any[]): IAttendance[] {
        throw new Error('Method not implemented.');
    }
    
    findOne(...args: KeyValuePair<IAttendance>[]): IAttendance {
        return this.findOneFunc("Attendances", ...args);
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
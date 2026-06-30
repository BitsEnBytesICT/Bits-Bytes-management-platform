import { dbQuery, dbAll } from '../../common/db';
import IAttendance from '../../types/attendance/IAttendance';
import { KeyValuePair } from '../../common/Validator';
import { daoBase, daoBaseType } from '../../common/daoBase';
import { Tables } from '../../types/tables/tablesList';

export default class AttendanceDao extends daoBase<IAttendance> implements daoBaseType<IAttendance> {
    async create(attendance: IAttendance) {
        await dbQuery('INSERT INTO Attendances (participantID, clockinDate) VALUES (?, ?)', [attendance.participantID, attendance.clockinDate]);
    }

    async update(where: KeyValuePair<IAttendance>, ...values: KeyValuePair<IAttendance>[]) {
        await this.updateFunc(Tables.Attendances, where, ...values);
    }
    
    delete(...args: any[]): void {
        throw new Error('Method not implemented.');
    }
    
    async list(...args: any[]): Promise<IAttendance[]> {
        throw new Error('Method not implemented.');
    }
    
    async findOne(...where: KeyValuePair<IAttendance>[]): Promise<IAttendance> {
        return await this.findOneFunc(Tables.Attendances, ...where);
    }

    async getAttendanceLast30Days(participantID: number): Promise<string[]> {
        const rows = await dbAll(
            `SELECT DISTINCT date(clockinDate) as date
             FROM Attendances
             WHERE participantID = ? AND clockinDate >= date('now', '-30 days')
             ORDER BY date DESC`,
            [participantID]
        ) as { date: string }[];
        return rows.map(r => r.date);
    }
}
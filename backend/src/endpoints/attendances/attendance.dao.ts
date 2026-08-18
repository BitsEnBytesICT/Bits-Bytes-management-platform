import { dbQuery, dbAll } from '../../common/db';
import IAttendance from '../../types/attendance/IAttendance';
import { KeyValuePair } from '../../common/Validator';
import { daoBase, daoBaseType } from '../../common/daoBase';
import { Tables } from '../../types/tables/tablesList';

export default class AttendanceDao extends daoBase<IAttendance> implements daoBaseType<IAttendance> {
    async create(attendance: IAttendance) {
        await dbQuery('INSERT INTO Attendances (participantID, clockinDate, signature) VALUES (?, ?, ?)',
            [attendance.participantID, attendance.clockinDate, attendance.signature],
        );
    }

    async update(where: KeyValuePair<IAttendance>, ...values: KeyValuePair<IAttendance>[]) {
        await this.updateFunc(Tables.Attendances, where, ...values);
    }
    
    async delete(where: KeyValuePair<IAttendance>) {
        await this.deleteFunc(Tables.Attendances, where);
    }
    
    async list(): Promise<IAttendance[]> {
        return await dbAll<IAttendance>(`SELECT * FROM ${Tables.Attendances}`);
    }
    
    async findOne(...where: KeyValuePair<IAttendance>[]): Promise<IAttendance | undefined> {
        return await this.findOneFunc(Tables.Attendances, ...where);
    }

    async getAttendanceLast30Days(participantID: number): Promise<string[]> {
        const rows = await dbAll<{date: string}>(
            `SELECT DISTINCT date(clockinDate) as date
             FROM Attendances
             WHERE participantID = ? AND clockinDate >= date('now', '-30 days')
             ORDER BY date DESC`,
            [participantID]
        )
        return rows.map(r => r.date);
    }
}

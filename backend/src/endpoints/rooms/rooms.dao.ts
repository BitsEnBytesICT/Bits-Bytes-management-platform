import { dbAll } from '../../common/db';
import type { KeyValuePair } from '../../common/Validator';
import type { IRoom } from '../../types/floorPlans/IRoom';
import { Tables } from '../../types/tables/tablesList';

export default class RoomDao {
    async list(...where: KeyValuePair<IRoom>[]): Promise<IRoom[]> {
        if (where.length === 0) return await dbAll<IRoom>(`SELECT * FROM ${Tables.Rooms}`);

        return await dbAll<IRoom>(
            `SELECT * FROM ${Tables.Rooms} WHERE ${where.map(([key, value]) =>
            value === undefined ? `${String(key)} IS NULL` : `${String(key)} = ?`).join(' AND ')}`,
            where.filter(([, value]) => value !== undefined).map(([, value]) => value),
        );
    }
}

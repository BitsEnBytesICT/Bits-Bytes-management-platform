import { dbAll } from '../../common/db';
import type { KeyValuePair } from '../../common/Validator';
import type { IWall } from '../../types/floorPlans/IWall';
import { Tables } from '../../types/tables/tablesList';

export default class WallDao {
    async list(...where: KeyValuePair<IWall>[]): Promise<IWall[]> {
        if (where.length === 0) return await dbAll<IWall>(`SELECT * FROM ${Tables.Walls}`);

        return await dbAll<IWall>(
            `SELECT * FROM ${Tables.Walls} WHERE ${where.map(([key, value]) =>
            value === undefined ? `${String(key)} IS NULL` : `${String(key)} = ?`).join(' AND ')}`,
            where.filter(([, value]) => value !== undefined).map(([, value]) => value),
        );
    }
}

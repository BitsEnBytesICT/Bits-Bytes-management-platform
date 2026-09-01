import { dbAll } from '../../common/db';
import type { KeyValuePair } from '../../common/Validator';
import type { IWorkplace } from '../../types/floorPlans/IWorkplace';
import { Tables } from '../../types/tables/tablesList';

export default class WorkplaceDao {
    async list(...where: KeyValuePair<IWorkplace>[]): Promise<IWorkplace[]> {
        if (where.length === 0) return await dbAll<IWorkplace>(`SELECT * FROM ${Tables.Workplaces}`);

        return await dbAll<IWorkplace>(
            `SELECT * FROM ${Tables.Workplaces} WHERE ${where.map(([key, value]) =>
            value === undefined ? `${String(key)} IS NULL` : `${String(key)} = ?`).join(' AND ')}`,
            where.filter(([, value]) => value !== undefined).map(([, value]) => value),
        );
    }
}

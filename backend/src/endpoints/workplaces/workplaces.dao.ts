import { daoBase, daoBaseType } from '../../common/daoBase';
import { dbAll } from '../../common/db';
import type { KeyValuePair } from '../../common/Validator';
import type { IWorkplace } from '../../types/floorPlans/IWorkplace';
import { Tables } from '../../types/tables/tablesList';

export default class WorkplaceDao extends daoBase<IWorkplace> implements daoBaseType<IWorkplace> {
    async create(workplace: IWorkplace): Promise<void> {
        await this.createFunc(Tables.Workplaces, ...Object.entries(workplace) as KeyValuePair<IWorkplace>[]);
    }

    async update(where: KeyValuePair<IWorkplace>, ...values: KeyValuePair<IWorkplace>[]) {
        await this.updateFunc(Tables.Workplaces, where, ...values);
    }

    delete(...args: any[]): void {
        throw new Error('Method not implemented.');
    }

    findOne(...args: KeyValuePair<IWorkplace>[]): Promise<IWorkplace | undefined> {
        throw new Error('Method not implemented.');
    }

    async list(...where: KeyValuePair<IWorkplace>[]): Promise<IWorkplace[]> {
        if (where.length === 0) return await dbAll<IWorkplace>(`SELECT * FROM ${Tables.Workplaces}`);

        return await dbAll<IWorkplace>(
            `SELECT * FROM ${Tables.Workplaces} WHERE ${where.map(([key, value]) =>
            value === undefined ? `${String(key)} IS NULL` : `${String(key)} = ?`).join(' AND ')}`,
            where.filter(([, value]) => value !== undefined).map(([, value]) => value),
        );
    }
}

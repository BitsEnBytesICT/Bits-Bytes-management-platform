import { daoBase, daoBaseType } from '../../common/daoBase';
import { dbAll } from '../../common/db';
import type { KeyValuePair } from '../../common/Validator';
import type { IRoom } from '../../types/floorPlans/IRoom';
import { Tables } from '../../types/tables/tablesList';

export default class RoomDao extends daoBase<IRoom> implements daoBaseType<IRoom> {
    create(item: IRoom): void {
        throw new Error('Method not implemented.');
    }

    update(where: KeyValuePair<IRoom>, ...args: KeyValuePair<IRoom>[]): void {
        throw new Error('Method not implemented.');
    }

    delete(...args: any[]): void {
        throw new Error('Method not implemented.');
    }

    async findOne(...where: KeyValuePair<IRoom>[]): Promise<IRoom | undefined> {
        return await this.findOneFunc(Tables.Rooms, ...where.map(([key, value]) => [key, value === null ? undefined : value]) as KeyValuePair<IRoom>[]);
    }

    async list(...where: KeyValuePair<IRoom>[]): Promise<IRoom[]> {
        if (where.length === 0) return await dbAll<IRoom>(`SELECT * FROM ${Tables.Rooms}`);

        return await dbAll<IRoom>(
            `SELECT * FROM ${Tables.Rooms} WHERE ${where.map(([key, value]) =>
            value === undefined ? `${String(key)} IS NULL` : `${String(key)} = ?`).join(' AND ')}`,
            where.filter(([, value]) => value !== undefined).map(([, value]) => value),
        );
    }
}

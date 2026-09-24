import { dbAll, dbGet, dbQuery } from "../../common/db";
import { daoBaseType, daoBase } from "../../common/daoBase";
import { KeyValuePair } from "../../common/Validator";

import IParticipant from "../../types/participant/IParticipant";
import { Tables } from "../../types/tables/tablesList";

export default class ParticipantDao extends daoBase<IParticipant> implements daoBaseType<IParticipant> {
    async create(participant: IParticipant) {
        await this.createFunc(Tables.Participants, ...Object.entries(participant) as KeyValuePair<IParticipant>[]);
    }

    async update(where: KeyValuePair<IParticipant>, ...values: KeyValuePair<IParticipant>[]) {
        await this.updateFunc(Tables.Participants, where, ...values);
    }

    async delete(where: KeyValuePair<IParticipant>) {
        await this.deleteFunc(Tables.Participants, where);
    }

    async list(...where: KeyValuePair<IParticipant>[]): Promise<IParticipant[]> {
        if (where.length === 0) return await dbAll<IParticipant>(`SELECT * FROM ${Tables.Participants}`);

        return await dbAll<IParticipant>(
            `SELECT * FROM ${Tables.Participants} WHERE ${where.map(([key, value]) =>
            value === undefined ? `${String(key)} IS NULL` : `${String(key)} = ?`).join(' AND ')}`,
            where.filter(([, value]) => value !== undefined).map(([, value]) => value),
        );
    }

    async findOne(...where: KeyValuePair<IParticipant>[]): Promise<IParticipant | undefined> {
        return await this.findOneFunc(Tables.Participants, ...where);
    }

    async count(): Promise<number> {
        const result = await dbGet<{count: number}>(`SELECT COUNT(*) as count FROM ${Tables.Participants}`);
        if (!result[0]) return 0;
        return result[0].count;
    }

    async countPresent(): Promise<number> {
        const result = await dbGet<{count: number}>(
            `SELECT COUNT(*) as count FROM ${Tables.Participants} WHERE clockedin = 1`);
        if (!result[0]) return 0;
        return result[0].count;
    }
}

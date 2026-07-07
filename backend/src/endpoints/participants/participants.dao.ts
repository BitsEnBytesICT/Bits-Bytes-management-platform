import { dbAll, dbGet } from "../../common/db";
import { daoBaseType, daoBase } from "../../common/daoBase";
import { KeyValuePair } from "../../common/Validator";

import IParticipant from "../../types/participant/IParticipant";
import { Tables } from "../../types/tables/tablesList";

export default class ParticipantDao extends daoBase<IParticipant> implements daoBaseType<IParticipant> {
    create(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    async update(where: KeyValuePair<IParticipant>, ...values: KeyValuePair<IParticipant>[]) {
        await this.updateFunc(Tables.Participants, where, ...values);
    }

    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    async list(): Promise<IParticipant[]> {
        return await dbAll<IParticipant>(`SELECT * FROM ${Tables.Participants}`, []);
    }

    async findOne(...where: KeyValuePair<IParticipant>[]): Promise<IParticipant | undefined> {
        return await this.findOneFunc(Tables.Participants, ...where);
    }

    async count(): Promise<number> {
        const result = await dbGet<{count: number}>(`SELECT COUNT(*) as count FROM ${Tables.Participants}`, []);
        if (!result[0]) return 0;
        return result[0].count;
    }

    async countPresent(): Promise<number> {
        const result = await dbGet<{count: number}>(
            `SELECT COUNT(*) as count FROM ${Tables.Participants} WHERE clockedin = 1`, []);
        if (!result[0]) return 0;
        return result[0].count;
    }
}
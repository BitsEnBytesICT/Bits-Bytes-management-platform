import { daoBase } from "../../common/daoBase";
import { dbAll } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import ISchedule from "../../types/schedules/ISchedule";
import { Tables } from "../../types/tables/tablesList";

export default class ScheduleDao extends daoBase<ISchedule> {
    async create(schedule: ISchedule): Promise<void> {
        const values = Object.entries(schedule).filter(([, value]) => value !== undefined) as KeyValuePair<ISchedule>[];
        await this.createFunc(Tables.Schedules, ...values);
    }

    async findOne(...where: KeyValuePair<ISchedule>[]): Promise<ISchedule | undefined> {
        return await this.findOneFunc(Tables.Schedules, ...where.map(([key, value]) => [key, value === null ? undefined : value]) as KeyValuePair<ISchedule>[]);
    }

    async list(...where: KeyValuePair<ISchedule>[]): Promise<ISchedule[]> {
        if (where.length === 0) return await dbAll<ISchedule>(`SELECT * FROM ${Tables.Schedules}`);

        return await dbAll<ISchedule>(
            `SELECT * FROM ${Tables.Schedules} WHERE ${where.map(([key, value]) =>
                value == null ? `${String(key)} IS NULL` : `${String(key)} = ?`).join(" AND ")}`,
            where.filter(([, value]) => value != null).map(([, value]) => value),
        );
    }
}

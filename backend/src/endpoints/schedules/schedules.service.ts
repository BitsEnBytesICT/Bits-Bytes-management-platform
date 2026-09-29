import { KeyValuePair, ValidatorTuple } from "../../common/Validator";
import { ErrorCodes } from "../../types/error/ErrorCodes";
import IError from "../../types/error/IError";
import ISchedule from "../../types/schedules/ISchedule";
import { partialScheduleValidator, scheduleValidator, scheduleValidatorFunctors } from "../../validators/scheduleValidator";
import ParticipantService from "../participants/participants.service";
import WorkplaceService from "../workplaces/workplaces.service";
import ScheduleDao from "./schedules.dao";

export default class ScheduleService {
    dao: ScheduleDao;
    private participantService: ParticipantService;

    constructor() {
        this.dao = new ScheduleDao();
        this.participantService = new ParticipantService();
    }

    async findOne(...where: KeyValuePair<ISchedule>[]): Promise<ISchedule | undefined> {
        return await this.dao.findOne(...where);
    }

    async list(...where: KeyValuePair<ISchedule>[]): Promise<ISchedule[]> {
        return await this.dao.list(...where);
    }

    async create(schedule: ISchedule): Promise<void> {
        if (!schedule) throw {
            date: new Date(),
            errorMSG: new Error("schedule is required"),
            code: ErrorCodes.InvalidData,
        } satisfies IError;

        const errors = scheduleValidator(schedule)
            .filter(result => result.kind === "error")
            .map(result => result.errorMSG);
        if (errors.length > 0) throw errors;

        const participant = await this.participantService.findOne(["id", schedule.participant]);
        if (!participant) throw {
            date: new Date(),
            errorMSG: new Error("participant not found"),
            code: ErrorCodes.InvalidData,
        } satisfies IError;

        await this.dao.create(schedule);
    }

    async update(where: KeyValuePair<ISchedule>, ...values: KeyValuePair<ISchedule>[]) {
        if (!where || !values) throw {
            date: new Date(),
            errorMSG: new Error("where clause and values are required"),
            code: ErrorCodes.InvalidData
        } satisfies IError

        const validatorFunctors = values.map((item) => 
            [item[0], scheduleValidatorFunctors[item[0]][0], scheduleValidatorFunctors[item[0]][1]] as ValidatorTuple<ISchedule>);

        const validationResult = partialScheduleValidator(Object.fromEntries(values), validatorFunctors);
        const errors = validationResult.filter((r) => r.kind === "error").map((r) => r.errorMSG);
        if (errors.length > 0) throw errors;

        await this.dao.update(where, ...values);
    }

    async delete(id: number) {
        await this.dao.delete(["id", id]);
    }
}

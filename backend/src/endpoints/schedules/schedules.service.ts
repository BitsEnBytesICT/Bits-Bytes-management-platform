import serviceBase from "../../common/serviceBase";
import { KeyValuePair, ValidatorTuple } from "../../common/Validator";
import { ErrorCodes } from "../../types/error/ErrorCodes";
import IError from "../../types/error/IError";
import ISchedule from "../../types/schedules/ISchedule";
import { partialScheduleValidator, scheduleValidator, scheduleValidatorFunctors } from "../../validators/scheduleValidator";
import ParticipantService from "../participants/participants.service";
import ScheduleDao from "./schedules.dao";

export default class ScheduleService implements serviceBase<ISchedule> {
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

        const schedules = await this.list();
        const overlappingSchedules = schedules.filter((s) => 
            (!s.endDate || schedule.startDate < s.endDate) && 
        (!schedule.endDate || s.startDate < schedule.endDate) &&
        ((s.monMorning && s.monMorning === schedule.monMorning) ||
        (s.monEvening && s.monEvening === schedule.monEvening) ||
        (s.thuesMorning && s.thuesMorning === schedule.thuesMorning) ||
        (s.thuesEvening && s.thuesEvening === schedule.thuesEvening) ||
        (s.wedMorning && s.wedMorning === schedule.wedMorning) ||
        (s.wedEvening && s.wedEvening === schedule.wedEvening) ||
        (s.thursMorning && s.thursMorning === schedule.thursMorning) ||
        (s.thursEvening && s.thursEvening === schedule.thursEvening) ||
        (s.friMorning && s.friMorning === schedule.friMorning) ||
        (s.friEvening && s.friEvening === schedule.friEvening)));

        if (overlappingSchedules.length > 0) {
            throw {
                date: new Date(),
                errorMSG: new Error(`schedule overlaps with: ${overlappingSchedules.flatMap((s) => s.name)}`),
                code: ErrorCodes.InvalidData,
            } satisfies IError
        }

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

        const originalSchedule = await this.findOne(where);
        if (!originalSchedule)  {
            throw {
                date: new Date(),
                errorMSG: new Error(`cannot find the original schedule`),
                code: ErrorCodes.InvalidData,
            } satisfies IError
        }

        Object.assign(originalSchedule, Object.fromEntries(values));
        const schedules = await this.list();
        const overlappingSchedules = schedules.filter((s) => s.id !== originalSchedule.id && 
        (!s.endDate || originalSchedule.startDate < s.endDate) && 
        (!originalSchedule.endDate || s.startDate < originalSchedule.endDate) &&
        ((s.monMorning && s.monMorning === originalSchedule.monMorning) ||
        (s.monEvening && s.monEvening === originalSchedule.monEvening) ||
        (s.thuesMorning && s.thuesMorning === originalSchedule.thuesMorning) ||
        (s.thuesEvening && s.thuesEvening === originalSchedule.thuesEvening) ||
        (s.wedMorning && s.wedMorning === originalSchedule.wedMorning) ||
        (s.wedEvening && s.wedEvening === originalSchedule.wedEvening) ||
        (s.thursMorning && s.thursMorning === originalSchedule.thursMorning) ||
        (s.thursEvening && s.thursEvening === originalSchedule.thursEvening) ||
        (s.friMorning && s.friMorning === originalSchedule.friMorning) ||
        (s.friEvening && s.friEvening === originalSchedule.friEvening)));

        if (overlappingSchedules.length > 0) {
            throw {
                date: new Date(),
                errorMSG: new Error(`schedule overlaps with: ${overlappingSchedules.flatMap((s) => s.name)}`),
                code: ErrorCodes.InvalidData,
            } satisfies IError
        }

        await this.dao.update(where, ...values);
    }

    async delete(id: number) {
        await this.dao.delete(["id", id]);
    }
}

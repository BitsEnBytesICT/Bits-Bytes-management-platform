import { KeyValuePair, ValidatorTuple } from "../../common/Validator";
import { ErrorCodes } from "../../types/error/ErrorCodes";
import IError from "../../types/error/IError";
import ISchedule from "../../types/schedules/ISchedule";
import { scheduleValidator } from "../../validators/scheduleValidator";
import ParticipantService from "../participants/participants.service";
import WorkplaceService from "../workplaces/workplaces.service";
import ScheduleDao from "./schedules.dao";

export default class ScheduleService {
    dao: ScheduleDao;
    private participantService: ParticipantService;
    private workplaceService: WorkplaceService;

    constructor() {
        this.dao = new ScheduleDao();
        this.participantService = new ParticipantService();
        this.workplaceService = new WorkplaceService();
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

        const workplaceIds = new Set([
            schedule.monMorning, schedule.monEvening,
            schedule.thuesMorning, schedule.thuesEvening,
            schedule.wedMorning, schedule.wedEvening,
            schedule.thursMorning, schedule.thursEvening,
            schedule.friMorning, schedule.friEvening,
        ]);

        for (const workplaceId of workplaceIds) {
            if (workplaceId == null) continue;

            const [workplace] = await this.workplaceService.list(["id", workplaceId]);
            if (!workplace) throw {
                date: new Date(),
                errorMSG: new Error(`workplace ${workplaceId} not found`),
                code: ErrorCodes.InvalidData,
            } satisfies IError;
        }

        if (schedule.id !== undefined && await this.dao.findOne(["id", schedule.id])) throw {
            date: new Date(),
            errorMSG: new Error("schedule id already exists"),
            code: ErrorCodes.InvalidData,
        } satisfies IError;

        await this.dao.create(schedule);
    }
}

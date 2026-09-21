import { Request, Response } from "express";
import AuthenticationDecorator from "../../common/authenticationDecorator";
import { PermissionsList } from "../../types/permissions/permissionsList";
import ScheduleService from "./schedules.service";

export default class ScheduleController {
    private service: ScheduleService;

    constructor() {
        this.service = new ScheduleService();
    }

    @AuthenticationDecorator(PermissionsList.scheduleList)
    async findOne(req: Request, res: Response) {
        const schedule = await this.service.findOne(...(req.body?.where ?? []));
        res.json(schedule);
    }

    @AuthenticationDecorator(PermissionsList.scheduleList)
    async list(req: Request, res: Response) {
        const schedules = await this.service.list(...(req.body?.where ?? []));
        res.json(schedules);
    }

    @AuthenticationDecorator(PermissionsList.scheduleCreate)
    async create(req: Request, res: Response) {
        await this.service.create(req.body?.schedule);
        res.sendStatus(200);
    }
}

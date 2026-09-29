import { Request, Response } from 'express';
import AuthenticationDecorator from '../../common/authenticationDecorator';
import { PermissionsList } from '../../types/permissions/permissionsList';
import ScanService from './attendance.service';

export default class AttendanceController {
    private service: ScanService;

    constructor() {
        this.service = new ScanService();
    }

    @AuthenticationDecorator(PermissionsList.attendanceScan)
    async scan(req: Request, res: Response) {
        const result = await this.service.scan(req.body.rfid_uid);

        if (!result.success && result.message === 'Kaart niet geregistreerd') {
            res.status(404).json(result);
            return;
        }

        res.json(result);
    }

    @AuthenticationDecorator(PermissionsList.attendanceList)
    async list (req: Request, res: Response) {
        const attendances = await this.service.list(...(req.body?.where ?? []));
        res.json(attendances);
    }

    @AuthenticationDecorator(PermissionsList.attendanceDelete)
    async delete (req: Request, res: Response) {
        await this.service.delete(req.body.where);
        res.sendStatus(200);
    }

    @AuthenticationDecorator(PermissionsList.attendanceClockIn)
    async create(req: Request, res: Response) {
        await this.service.create(req.body.rfid_uid, req.body.signature);
        res.sendStatus(200);
    }

    @AuthenticationDecorator(PermissionsList.attendanceList)
    async attendanceLast30(req: Request, res: Response) {
        const dates = await this.service.fetchLast30Days(req.body.rfid_uid);
        res.json({ dates });
    }
}

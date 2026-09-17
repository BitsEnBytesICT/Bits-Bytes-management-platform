import { Request, Response } from 'express';
import AuthenticationDecorator from '../../common/authenticationDecorator';
import ScanService from './attendance.service';
import IAttendance from '../../types/attendance/IAttendance';
import { KeyValuePair } from '../../common/Validator';

export default class AttendanceController {
    private service: ScanService;

    constructor() {
        this.service = new ScanService();
    }

    @AuthenticationDecorator('attendance.scan')
    async scan(req: Request, res: Response) {
        const result = await this.service.scan(req.body.rfid_uid);

        if (!result.success && result.message === 'Kaart niet geregistreerd') {
            res.status(404).json(result);
            return;
        }

        res.json(result);
    }

    @AuthenticationDecorator("attendance.list")
    async list (req: Request, res: Response) {
        const attendances = await this.service.list();
        res.json(attendances);
    }

    @AuthenticationDecorator("attendance.delete")
    async delete (req: Request, res: Response) {
        await this.service.delete(req.body.where);
        res.sendStatus(200);
    }

    @AuthenticationDecorator('attendance.clock_in')
    async create(req: Request, res: Response) {
        await this.service.create(req.body.rfid_uid, req.body.signature);
        res.sendStatus(200);
    }

    @AuthenticationDecorator('attendance.update')
    async update(req: Request, res: Response) {
        const { id, signature } = req.body;

        if (id == null || signature == null) {
            res.status(400).json(["id en signature zijn verplicht"]);
            return;
        }

        const signatureUpdate: Partial<IAttendance> = {
            signature: signature
        }

        await this.service.update(["id", id], ...Object.entries(signatureUpdate) as KeyValuePair<IAttendance>[])
        res.sendStatus(200);
    }

    @AuthenticationDecorator('attendance.list')
    async attendanceLast30(req: Request, res: Response) {
        const dates = await this.service.fetchLast30Days(req.body.rfid_uid);
        res.json({ dates });
    }
}

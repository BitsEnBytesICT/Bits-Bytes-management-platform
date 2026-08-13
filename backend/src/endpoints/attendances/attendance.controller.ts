import { Request, Response } from 'express';
import AuthenticationDecorator from '../../common/authenticationDecorator';
import ScanService from './attendance.service';

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

    @AuthenticationDecorator('attendance.clock_in')
    async clockInWithSignature(req: Request, res: Response) {
        await this.service.processClockInWithSignature(req.body.rfid_uid, req.body.signature);
        res.sendStatus(200);
    }

    @AuthenticationDecorator('attendance.list')
    async attendanceLast30(req: Request, res: Response) {
        const dates = await this.service.fetchLast30Days(req.body.rfid_uid);
        res.json({ dates });
    }
}

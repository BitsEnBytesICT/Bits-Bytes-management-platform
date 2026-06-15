import { Request, Response } from 'express';
import ScanService from './attendance.service';

export default class AttendanceController {
    private service: ScanService;

    constructor() {
        this.service = new ScanService();
    }

    scan = (req: Request, res: Response): void => {
        const result = this.service.scan(req.body.rfid_uid);

        if (!result.success && result.message === 'Kaart niet geregistreerd') {
            res.status(404).json(result);
            return;
        }

        res.json(result);
    }

    clockInWithSignature = (req: Request, res: Response): void => {
        this.service.processClockInWithSignature(req.body.rfid_uid, req.body.signature);
        res.sendStatus(200);
    }

    attendanceLast30 = (req: Request, res: Response): void => {
        const dates = this.service.fetchLast30Days(req.body.rfid_uid);
        res.json({ dates });
    }
}

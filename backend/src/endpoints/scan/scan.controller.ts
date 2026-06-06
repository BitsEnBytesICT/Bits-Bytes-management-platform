import { Request, Response } from 'express';
import ScanService from './scan.service';

export default class ScanController {
    private service: ScanService;

    constructor() {
        this.service = new ScanService();
    }

    scan = (req: Request, res: Response): void => {
        const rfid_uid = req.body.rfid_uid;
        if (!rfid_uid || typeof rfid_uid !== 'string') {
            res.status(422).json({ success: false, message: 'Missing rfid_uid' });
            return;
        }

        const result = this.service.processScan(rfid_uid);

        if (!result.success && result.message === 'Kaart niet geregistreerd') {
            res.status(404).json(result);
            return;
        }

        res.json(result);
    }

    clockInWithSignature = (req: Request, res: Response): void => {
        const rfid_uid = req.body.rfid_uid;
        const signature = req.body.signature;

        if (!rfid_uid || typeof rfid_uid !== 'string') {
            res.status(422).json({ success: false, message: 'Missing rfid_uid' });
            return;
        }
        if (!signature || typeof signature !== 'string') {
            res.status(422).json({ success: false, message: 'Missing signature' });
            return;
        }

        const ok = this.service.processClockInWithSignature(rfid_uid, signature);

        if (!ok) {
            res.status(404).json({ success: false, message: 'Kaart niet geregistreerd' });
            return;
        }

        res.sendStatus(200);
    }

    attendanceLast30 = (req: Request, res: Response): void => {
        const rfid_uid = req.body.rfid_uid;
        if (!rfid_uid || typeof rfid_uid !== 'string') {
            res.json({ dates: [] });
            return;
        }

        const dates = this.service.fetchLast30Days(rfid_uid);
        res.json({ dates });
    }
}

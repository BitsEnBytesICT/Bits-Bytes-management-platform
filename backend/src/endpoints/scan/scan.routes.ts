import express from 'express';
import { Router } from 'express';
import ScanController from './scan.controller';

class ScanRouter {
    private router: Router;
    private controller: ScanController = new ScanController();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/api/scan', this.controller.scan);
        this.router.post('/api/clock_in_with_signature', this.controller.clockInWithSignature);
        this.router.post('/api/attendance_last_30', this.controller.attendanceLast30);
    }

    getRouter() {
        return this.router;
    }
}

export default new ScanRouter().getRouter();

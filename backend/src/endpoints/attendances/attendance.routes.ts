import express from 'express';
import { Router } from 'express';
import ScanController from './attendance.controller';

class AttendanceRouter {
    private router: Router;
    private controller: ScanController = new ScanController();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/api/attendance', this.controller.list.bind(this.controller));
        this.router.post('/api/scan', this.controller.scan.bind(this.controller));
        this.router.post('/api/clock_in_with_signature', this.controller.create.bind(this.controller));
        this.router.post('/api/attendance_last_30', this.controller.attendanceLast30.bind(this.controller));
        this.router.delete('/api/attendance/delete', this.controller.delete.bind(this.controller));
    }

    getRouter() {
        return this.router;
    }
}

export default new AttendanceRouter().getRouter();

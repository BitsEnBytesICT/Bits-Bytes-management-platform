import express, { Router } from "express";
import ScheduleController from "./schedules.controller";

class ScheduleRouter {
    private router: Router;
    private controller: ScheduleController = new ScheduleController();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post("/api/schedules", this.controller.list.bind(this.controller));
        this.router.post("/api/schedules/findOne", this.controller.findOne.bind(this.controller));
        this.router.post("/api/schedules/create", this.controller.create.bind(this.controller));
    }

    getRouter() {
        return this.router;
    }
}

export default new ScheduleRouter().getRouter();

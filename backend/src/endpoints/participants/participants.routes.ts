import express from 'express';
import { Router } from 'express';
import ParticipantController from './participants.controller';

class ParticipantRouter {
    private router: Router;
    private controller: ParticipantController = new ParticipantController();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/api/participants', this.controller.list);
        this.router.get('/api/participants/count', this.controller.count);
        this.router.get('/api/participants/count/present', this.controller.countPresent);
    }

    getRouter() {
        return this.router;
    }
}

export default new ParticipantRouter().getRouter();

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
        this.router.get('/api/participants', this.controller.list.bind(this.controller));
        this.router.get('/api/participants/count', this.controller.count.bind(this.controller));
        this.router.get('/api/participants/count/present', this.controller.countPresent.bind(this.controller));
        this.router.get('/api/participants/create', this.controller.create.bind(this.controller));
        this.router.get('/api/participants/update', this.controller.update.bind(this.controller));
        this.router.get('/api/participants/delete', this.controller.delete.bind(this.controller));
    }

    getRouter() {
        return this.router;
    }
}

export default new ParticipantRouter().getRouter();
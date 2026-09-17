import express, { Router } from 'express';
import WorkplaceController from './workplaces.controller';

class WorkplaceRouter {
    private router: Router;
    private controller: WorkplaceController = new WorkplaceController();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/api/workplaces', this.controller.list.bind(this.controller));
    }

    getRouter() {
        return this.router;
    }
}

export default new WorkplaceRouter().getRouter();

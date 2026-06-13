import express from 'express';
import { Router, Request, Response } from 'express';

class HealthRouter {
    private router: Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/health', (req: Request, res: Response) => {
            res.sendStatus(200);
        });
    }

    getRouter() {
        return this.router;
    }
}

export default new HealthRouter().getRouter();

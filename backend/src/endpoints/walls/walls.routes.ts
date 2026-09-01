import express, { Router } from 'express';
import WallController from './walls.controller';

class WallRouter {
    private router: Router;
    private controller: WallController = new WallController();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/api/walls', this.controller.list.bind(this.controller));
    }

    getRouter() {
        return this.router;
    }
}

export default new WallRouter().getRouter();

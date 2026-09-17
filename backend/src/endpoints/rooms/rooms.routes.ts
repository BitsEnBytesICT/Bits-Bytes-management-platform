import express, { Router } from 'express';
import RoomController from './rooms.controller';

class RoomRouter {
    private router: Router;
    private controller: RoomController = new RoomController();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/api/rooms', this.controller.list.bind(this.controller));
    }

    getRouter() {
        return this.router;
    }
}

export default new RoomRouter().getRouter();

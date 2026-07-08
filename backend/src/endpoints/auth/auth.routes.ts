import express from 'express';
import { Router } from 'express';
import AuthController from './auth.controller';

class AuthRouter {
    private router: Router;
    private controller: AuthController = new AuthController();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post('/api/login', this.controller.login);
        this.router.post('/api/verify', this.controller.verify);
        this.router.post('/api/refresh-token', this.controller.refresh);
    }

    getRouter() {
        return this.router;
    }
}

export default new AuthRouter().getRouter();

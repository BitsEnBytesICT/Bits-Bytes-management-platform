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
        this.router.post('/api/login', this.controller.login.bind(this.controller));
        this.router.post('/api/verify', this.controller.verify.bind(this.controller));
        this.router.post('/api/refresh-token', this.controller.refresh.bind(this.controller));
        this.router.post('/api/logout', this.controller.logout.bind(this.controller));
    }

    getRouter() {
        return this.router;
    }
}

export default new AuthRouter().getRouter();

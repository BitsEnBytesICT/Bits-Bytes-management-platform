import express from 'express';
import { Router } from 'express';
import AccountController from './accounts.controller';

class AccountRouter {
    private router: Router;
    private controller: AccountController = new AccountController();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/api/account/current', this.controller.current.bind(this.controller));
    }

    getRouter() {
        return this.router;
    }
}

export default new AccountRouter().getRouter();

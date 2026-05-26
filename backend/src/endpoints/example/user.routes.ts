import express, { Request, Response } from "express";
import { Router } from "express";
import UserController from "./user.controller";

class UserRouter {
    private router: Router;
    controller: UserController = new UserController();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        //function: to connect the route to the controller where the params are handled
        this.router.get('/users', this.controller.list)
        this.router.put('/users', this.controller.create)
    }

    getRouter() {
        return this.router;
    }
}

export default new UserRouter().getRouter();
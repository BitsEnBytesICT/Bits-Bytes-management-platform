import express from 'express';
import { Router, Request, Response } from "express";
import InventoryController from "./inventory.controller";

class InventoryRouter {
    private router: Router;
    private controller: InventoryController = new InventoryController();

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    initializeRoutes(): void {
       this.router.post("/api/inventory/create", this.controller.create.bind(this.controller));
       this.router.patch("/api/inventory/update", this.controller.update.bind(this.controller));
       this.router.delete("/api/inventory/delete", this.controller.delete.bind(this.controller));
    }

    getRouter() {
        return this.router;
    }
}

export default new InventoryRouter().getRouter();
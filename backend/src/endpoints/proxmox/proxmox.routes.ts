import express from 'express';
import { Router } from 'express';
import ProxmoxController from './proxmox.controller';

class ProxmoxRouter {
    private router: Router;
    private controller: ProxmoxController = new ProxmoxController();

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/api/proxmox/list', this.controller.list.bind(this.controller));
    }

    getRouter() {
        return this.router;
    }
}

export default new ProxmoxRouter().getRouter();

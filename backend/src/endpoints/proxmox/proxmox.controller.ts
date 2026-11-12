import { Request, Response } from 'express';
import PRoxmoxService from './proxmox.service';

export default class ProxmoxController {
    private service: PRoxmoxService;

    constructor() {
        this.service = new PRoxmoxService();
    }

    //@AuthenticationDecorator(PermissionsList.accountCurrent)
    async list (req: Request, res: Response) {
        const vms = await this.service.list();
        console.log(vms);
        res.status(200).json(vms);
    }
}

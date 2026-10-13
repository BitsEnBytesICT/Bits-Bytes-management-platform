import { Request, Response } from 'express';
import InventoryService from "./inventory.service";
import AuthenticationDecorator from "../../common/authenticationDecorator";
import {PermissionsList} from "../../types/permissions/permissionsList";

export default class InventoryController {
    private service: InventoryService;

    constructor() {
        this.service = new InventoryService();
    }

    @AuthenticationDecorator(PermissionsList.createInventory)
    async create(req: Request, res: Response) {
        // await this.service.create();
    }

    @AuthenticationDecorator(PermissionsList.updateInventory)
    async update(req: Request, res: Response) {
        // await this.service.update();
    }

    @AuthenticationDecorator(PermissionsList.deleteInventory)
    async delete(req: Request, res: Response) {
        // await this.service.delete();
    }
}
import AuthDAO from "../auth/auth.dao";
import AuthService from "../auth/auth.service";
import serviceBase from "../../common/serviceBase";
import IInventory from "../../types/inventory/IInventory";
import InventoryDao from "./inventory.dao";
import { KeyValuePair } from "../../common/Validator";

export default class InventoryService implements serviceBase<IInventory> {
    dao: InventoryDao

    constructor() {
        this.dao = new InventoryDao();
    }

    create(...args: any[]): void {
        throw new Error("Method not implemented.");
    }
    update(where: KeyValuePair<IInventory>, ...args: KeyValuePair<IInventory>[]): void {
        throw new Error("Method not implemented.");
    }
    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }
    list(...args: any[]): Promise<IInventory[]> {
        throw new Error("Method not implemented.");
    }
    findOne(...args: KeyValuePair<IInventory>[]): Promise<IInventory | undefined> {
        throw new Error("Method not implemented.");
    }
}
import serviceBase from "../../common/serviceBase";
import IInventory from "../../types/inventory/IInventory";
import InventoryDao from "./inventory.dao";
import { KeyValuePair } from "../../common/Validator";
import { ErrorCodes } from "../../types/error/ErrorCodes";
import IError from "../../types/error/IError";
import { getCurrentDate } from "../../common/dateFunctions";
import { inventoryValidator } from "../../validators/inventoryValidator";

export default class InventoryService implements serviceBase<IInventory> {
    dao: InventoryDao

    constructor() {
        this.dao = new InventoryDao();
    }

    async create(item: IInventory): Promise<void> {
        if (!item) throw {
            date: new Date(),
            errorMSG: new Error("inventory item is required"),
            code: ErrorCodes.InvalidData,
        } satisfies IError;

        const newItem: IInventory = {
            category: item.category,
            categoryId: item.categoryId,
            description: item.description,
            quantity: item.quantity,
            serialNumber: item.serialNumber,
            createdAt: getCurrentDate(),
        };

        const errors = inventoryValidator(newItem)
            .filter(result => result.kind === "error")
            .map(result => result.errorMSG);
        if (errors.length > 0) throw errors;

        await this.dao.create(newItem);
    }
    update(where: KeyValuePair<IInventory>, ...args: KeyValuePair<IInventory>[]): void {
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
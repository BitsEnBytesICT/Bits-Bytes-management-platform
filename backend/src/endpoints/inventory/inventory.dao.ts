import serviceBase from "../../common/serviceBase";
import IInventory from "../../types/inventory/IInventory";
import {daoBase, daoBaseType} from "../../common/daoBase";
import { KeyValuePair } from "../../common/Validator";

export default class InventoryDao extends daoBase<IInventory> implements daoBaseType<IInventory> {
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
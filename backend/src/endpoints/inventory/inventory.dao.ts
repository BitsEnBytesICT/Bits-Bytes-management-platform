import IInventory from "../../types/inventory/IInventory";
import {daoBase, daoBaseType} from "../../common/daoBase";
import { inventoryDBQuery } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import { Tables } from "../../types/tables/tablesList";

export default class InventoryDao extends daoBase<IInventory> implements daoBaseType<IInventory> {
    async create(item: IInventory): Promise<void> {
        const values = Object.entries(item).filter(([, value]) => value !== undefined) as KeyValuePair<IInventory>[];
        await inventoryDBQuery<IInventory>(`INSERT INTO ${Tables.Items} (${values.map(([key]) => String(key)).join(", ")}) VALUES (${values.map(() => "?").join(", ")})`,
            values.map(([, value]) => value));
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
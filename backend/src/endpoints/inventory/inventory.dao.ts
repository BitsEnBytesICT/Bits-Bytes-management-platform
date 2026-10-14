import IInventory from "../../types/inventory/IInventory";
import {daoBase, daoBaseType} from "../../common/daoBase";
import { inventoryDBAll, inventoryDBQuery } from "../../common/db";
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

    async list(...where: KeyValuePair<IInventory>[]): Promise<IInventory[]> {
        if (where.length === 0) return await inventoryDBAll<IInventory>(`SELECT * FROM ${Tables.Items}`);

        return await inventoryDBAll<IInventory>(
            `SELECT * FROM ${Tables.Items} WHERE ${where.map(([key, value]) =>
            value === undefined ? `${String(key)} IS NULL` : `${String(key)} = ?`).join(" AND ")}`,
            where.filter(([, value]) => value !== undefined).map(([, value]) => value));
    }

    findOne(...args: KeyValuePair<IInventory>[]): Promise<IInventory | undefined> {
        throw new Error("Method not implemented.");
    }

}
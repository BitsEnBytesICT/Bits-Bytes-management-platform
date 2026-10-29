import IInventory from "../../types/inventory/IInventory";
import {daoBase, daoBaseType} from "../../common/daoBase";
import { inventoryDBAll, inventoryDBQuery } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import { Tables } from "../../types/tables/tablesList";

type ColumnType = "string" | "number" | "boolean";

const categoriesWithColumns = [
    {
        name: "cpu",
        columns: [
            ["id", "number"],
            ["model", "string"],
            ["base speed", "number"],
            ["boost speed", "number"],
            ["cores", "number"],
            ["threads", "number"],
        ],
    },
    {
        name: "ram",
        columns: [
            ["id", "number"],
            ["model", "string"],
            ["capacity", "number"],
            ["speed", "number"],
        ],
    },
] as const satisfies readonly {
    name: string;
    columns: readonly (readonly [string, ColumnType])[];
}[];

interface TypeMapping {
    string: string;
    number: number;
    boolean: boolean;
}

type ExtractColumns<T extends readonly (readonly [string, string])[]> = {
    [K in T[number] as K[0]]: K[1] extends keyof TypeMapping ? TypeMapping[K[1]] : any;
};

const a: Partial<ExtractColumns<typeof categoriesWithColumns[0]["columns"]>> = {

};
console.log(a);

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
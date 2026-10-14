import http from "../../common/http.ts";
import type IInventory from "../../types/Inventory/IInventory.ts";

export class InventoryService {
    async getInventoryItems(): Promise<IInventory[]> {
        const response: Response = await http("/api/inventory/list", "GET");
        if (response.status === 200) {
            return await response.json();
        } else {
            alert("Er is iets fout gegaan bij het ophalen van de inventarisatie, bekijk console");
            console.log("Inventarisatie geeft error", response.status);
        }
    }
}

import http from "../../common/http.ts";
import type IInventory from "../../types/Inventory/IInventory.ts";
import type ICategory from "../../types/Inventory/ICategory.ts";

export class InventoryService {
    async getInventoryItems(): Promise<IInventory[]> {
        const response: Response = await http("/api/inventory/list", "GET");
        if (response.status === 200) {
            return await response.json();
        } else {
            alert("Er is iets fout gegaan bij het ophalen van de inventarisatie, bekijk console");
            console.log("Inventarisatie geeft error", response.status);
        }
        return [];
    }

    async getCategories(): Promise<ICategory[]> {
        const response: Response = await http("/api/inventory/category/list", "GET");
        if (response.status === 200) {
            return await response.json();
        } else {
            alert("Er is iets fout gegaan bij het ophalen van de categorieën, bekijk console");
            console.log("Categorieën geven error", response.status);
        }
        return [];
    }

    async createItem(item: IInventory): Promise<string[] | undefined> {
        const response: Response = await http("/api/inventory/create", "POST", {
            inventory: item,
        });
        if (response.status === 200) return;
        return await response.json();
    }

    async createCategory(name: string, description?: string): Promise<string[] | undefined> {
        if (!name || name.trim().length === 0) return ["Categorie naam is verplicht"];
        const response: Response = await http("/api/inventory/category/create", "POST", {
            category: {
                name: name.trim(),
                description: description?.trim() || undefined,
            },
        });
        if (response.status === 200) return;
        return await response.json();
    }
}

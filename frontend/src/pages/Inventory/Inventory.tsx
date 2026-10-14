import {useEffect, useState} from "react";
import http from "../../common/http";

interface IInventory {
    id?: number;
    category: string;
    categoryId: number;
    description: string;
    quantity: number;
    serialNumber: string;
    createdAt?: string;
}

export default function Inventory() {
    const [inventoryItems, setInventoryItems] = useState<IInventory>();

    useEffect(() => {
        const fetchInventoryItems = async (): Promise<void> => {
            const response: Response = await http("/api/inventory/list", "GET");
            if (response.status === 200) {
                const items = await response.json();
                console.log(items);
                setInventoryItems(items);
            } else {
                alert("Er is iets fout gegaan bij het ophalen van de inventarisatie, bekijk console");
                console.log("Inventarisatie geeft error", response.status);
            }
        };

        Promise.all([fetchInventoryItems()])
            .then(() => {
                console.log("finished promise chain");
            })
            .catch(console.error);
    }, []);

    return <div></div>;
}

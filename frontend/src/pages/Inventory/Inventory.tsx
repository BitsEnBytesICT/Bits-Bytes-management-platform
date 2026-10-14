import {useEffect, useState} from "react";
import http from "../../common/http";
import Table from "../../common/components/Table";
import {formatDate, fromBackendDate} from "../../common/helperFunctions";
import type {ITableColumn} from "../../types/compontents/ITable";

interface IInventory {
    id?: number;
    category: string;
    categoryId: number;
    description: string;
    quantity: number;
    serialNumber: string;
    createdAt?: string;
}

const inventoryColumns: ITableColumn<IInventory>[] = [
    {key: "id", label: "ID"},
    {key: "category", label: "Categorie", sortable: true},
    {key: "description", label: "Omschrijving"},
    {key: "quantity", label: "Aantal", sortable: true},
    {key: "serialNumber", label: "Serienummer"},
    {
        key: "createdAt",
        label: "Aangemaakt",
        render: row => (row.createdAt ? formatDate(fromBackendDate(row.createdAt)) : "-"),
    },
];

export default function Inventory() {
    const [inventoryItems, setInventoryItems] = useState<IInventory[]>([]);

    useEffect(() => {
        const fetchInventoryItems = async (): Promise<void> => {
            const response: Response = await http("/api/inventory/list", "GET");
            if (response.status === 200) {
                const items = await response.json();
                setInventoryItems(items);
            } else {
                alert("Er is iets fout gegaan bij het ophalen van de inventarisatie, bekijk console");
                console.log("Inventarisatie geeft error", response.status);
            }
        };

        fetchInventoryItems().catch(console.error);
    }, []);

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <div className="flex-1 min-h-0">
                <Table
                    columns={inventoryColumns}
                    rows={inventoryItems}
                    setRows={setInventoryItems}
                    rowKey="id"
                    checkBox={false}
                />
            </div>
        </div>
    );
}

import Table from "../../../common/components/Table";

import type {ITableColumn} from "../../../types/compontents/ITable";
import type IInventory from "../../../types/Inventory/IInventory.ts";
import {formatDate, fromBackendDate} from "../../../common/helperFunctions.ts";

interface IInventoryTable {
    inventory: IInventory[];
    setInventory: (value: IInventory[]) => void;
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
        sortable: true,
        render: row => (row.createdAt ? formatDate(fromBackendDate(row.createdAt)) : "-"),
    },
];

export default function InventoryTable({inventory, setInventory}: IInventoryTable) {
    return (
        <div className="flex-1 min-h-0">
            <Table columns={inventoryColumns} rows={inventory} setRows={setInventory} rowKey="id" checkBox={false} />
        </div>
    );
}

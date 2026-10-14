import {useEffect, useState} from "react";
import http from "../../common/http";
import SmallButton from "../../common/components/SmallButton.tsx";
import {IconFilter} from "../../assets";
import type IInventory from "../../types/Inventory/IInventory.ts";
import InventoryTable from "./components/InventoryTable.tsx";
import InventoryFilter from "./components/InventoryFilter.tsx";

export default function Inventory() {
    const [inventoryItems, setInventoryItems] = useState<IInventory[]>([]);
    const [filteredInventoryItems, setFilteredInventoryItems] = useState<IInventory[]>([]);
    const [isFilterShown, setIsFilterShown] = useState(false);

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
            <div className={"mb-4 flex flex-row justify-between"}>
                <SmallButton
                    label={"Filter"}
                    active={isFilterShown}
                    icon={<img src={IconFilter} className="select-none [-webkit-user-drag:none]" />}
                    onClick={() => setIsFilterShown(!isFilterShown)}
                />
            </div>
            <div>
                <InventoryFilter
                    inventory={inventoryItems}
                    isShown={isFilterShown}
                    setFilteredInventory={setFilteredInventoryItems}></InventoryFilter>
            </div>
            <InventoryTable inventory={filteredInventoryItems} setInventory={setFilteredInventoryItems} />
        </div>
    );
}

import {useEffect, useState} from "react";
import SmallButton from "../../common/components/SmallButton.tsx";
import type IInventory from "../../types/Inventory/IInventory.ts";
import InventoryTable from "./components/InventoryTable.tsx";
import InventoryFilter from "./components/InventoryFilter.tsx";
import {InventoryService} from "./inventory.service.ts";
import {IconFilter, PlusIcon} from "../../assets";

export default function Inventory() {
    const [inventoryItems, setInventoryItems] = useState<IInventory[]>([]);
    const [filteredInventoryItems, setFilteredInventoryItems] = useState<IInventory[]>([]);
    const [isFilterShown, setIsFilterShown] = useState(false);

    const [isCategorySelected] = useState<boolean>(false);

    const service = new InventoryService();

    useEffect(() => {
        const fetchInventoryItems = async (): Promise<void> => {
            const items = await service.getInventoryItems();
            setInventoryItems(items);
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
                <div className={"flex flex-row justify-end gap-2"}>
                    {isCategorySelected && (
                        <div>
                            <SmallButton
                                label={"Voeg item toe"}
                                active={isCategorySelected}
                                icon={<img src={PlusIcon} className="select-none [-webkit-user-drag:none]" />}
                            />
                            <SmallButton
                                label={"Voeg categorie toe"}
                                active={isCategorySelected}
                                icon={<img src={PlusIcon} className="select-none [-webkit-user-drag:none]" />}
                            />
                        </div>
                    )}
                </div>
            </div>
            <InventoryFilter
                inventory={inventoryItems}
                isShown={isFilterShown}
                setFilteredInventory={setFilteredInventoryItems}
            />
            <InventoryTable inventory={filteredInventoryItems} setInventory={setFilteredInventoryItems} />
        </div>
    );
}

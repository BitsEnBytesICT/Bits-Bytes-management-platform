import {useEffect, useMemo, useState} from "react";
import SmallButton from "../../common/components/SmallButton.tsx";
import type IInventory from "../../types/Inventory/IInventory.ts";
import InventoryTable from "./components/InventoryTable.tsx";
import InventoryFilter from "./components/InventoryFilter.tsx";
import CategorySelect, {ALL_CATEGORIES} from "./components/CategorySelect.tsx";
import {InventoryService} from "./inventory.service.ts";
import {IconFilter, PlusIcon} from "../../assets";
import InventoryCategoryPopup from "./components/InventoryCategoryPopup.tsx";

export default function Inventory() {
    const [inventoryItems, setInventoryItems] = useState<IInventory[]>([]);
    const [filteredInventoryItems, setFilteredInventoryItems] = useState<IInventory[]>([]);
    const [isFilterShown, setIsFilterShown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES);

    const [isCategorySelected] = useState<boolean>(true);
    const [isInventoryCategoryPopupOpen, setIsInventoryCategoryPopupOpen] = useState(false);

    const service = new InventoryService();

    useEffect(() => {
        const fetchInventoryItems = async (): Promise<void> => {
            const items = await service.getInventoryItems();
            setInventoryItems(items);
        };
        fetchInventoryItems().catch(console.error);
    }, []);

    const categories = useMemo(
        () => [...new Set(inventoryItems.map(item => item.category))].sort((a, b) => a.localeCompare(b)),
        [inventoryItems],
    );

    const visibleInventoryItems = useMemo(
        () =>
            selectedCategory === ALL_CATEGORIES
                ? filteredInventoryItems
                : filteredInventoryItems.filter(item => item.category === selectedCategory),
        [filteredInventoryItems, selectedCategory],
    );

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <div className={"mb-4 flex flex-row justify-between items-center"}>
                <div className="flex flex-row items-center gap-2">
                    <SmallButton
                        label={"Filter"}
                        active={isFilterShown}
                        icon={<img src={IconFilter} className="select-none [-webkit-user-drag:none]" />}
                        onClick={() => setIsFilterShown(!isFilterShown)}
                    />
                    <CategorySelect categories={categories} value={selectedCategory} onChange={setSelectedCategory} />
                </div>

                <div>
                    {isCategorySelected && (
                        <div className={"flex flex-row justify-end gap-2"}>
                            <SmallButton
                                label={"Voeg item toe"}
                                icon={<img src={PlusIcon} className="select-none [-webkit-user-drag:none]" />}
                            />
                            <SmallButton
                                label={"Voeg categorie toe"}
                                icon={<img src={PlusIcon} className="select-none [-webkit-user-drag:none]" />}
                            />
                        </div>
                    )}
                    <div>
                        {isInventoryCategoryPopupOpen && (
                            <InventoryCategoryPopup onClose={() => setIsInventoryCategoryPopupOpen(false)} />
                        )}
                    </div>
                </div>
            </div>

            <InventoryFilter
                inventory={inventoryItems}
                isShown={isFilterShown}
                setFilteredInventory={setFilteredInventoryItems}
            />
            <InventoryTable inventory={visibleInventoryItems} setInventory={setFilteredInventoryItems} />
        </div>
    );
}

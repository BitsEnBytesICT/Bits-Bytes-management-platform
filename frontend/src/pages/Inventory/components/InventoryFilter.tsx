import {useEffect, useRef, useState} from "react";
import type {ReactNode} from "react";

import Filter from "../../../common/components/Filter";

import useLocalStorage from "../../../common/hooks/useLocalStorage";
import type IInventory from "../../../types/Inventory/IInventory.ts";

interface IInventoryFilter {
    inventory: IInventory[];
    isShown: boolean;
    children: ReactNode;
    setFilteredInventory: (value: IInventory[]) => void;
}

export default function InventoryFilter({inventory, isShown, children, setFilteredInventory}: IInventoryFilter) {
    const [searchTerm, setSearchTerm] = useLocalStorage("inventory.searchTerm", "");
    const [categoryFilter, setCategoryFilter] = useLocalStorage("inventory.categoryFilter", "");
    const [filterHeight, setFilterHeight] = useState(0);

    const filterContentRef = useRef<HTMLDivElement>(null);

    function matchesFilters(item: IInventory): boolean {
        const term = searchTerm.toLowerCase();

        const matchesSearch =
            !searchTerm ||
            [item.id, item.category, item.description, item.quantity, item.serialNumber].some(value =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(term),
            );

        const matchesCategory = !categoryFilter || item.category === categoryFilter;

        return matchesSearch && matchesCategory;
    }

    useEffect(() => {
        setFilterHeight(isShown ? (filterContentRef.current?.scrollHeight ?? 0) : 0);
    }, [isShown]);

    useEffect(() => {
        setFilteredInventory(inventory.filter(matchesFilters));
    }, [inventory, searchTerm, categoryFilter]);

    const categories = [...new Set(inventory.map(item => item.category).filter(Boolean))];

    const filterGroups = [
        {
            label: "Categorie",
            options: categories,
            value: categoryFilter,
            onChange: setCategoryFilter,
        },
    ];

    return (
        <>
            <div
                className={`${isShown ? "mb-4" : "mb-0"} overflow-hidden transition-[height,margin-bottom] duration-300
                    ease-in-out`}
                style={{height: filterHeight}}>
                <div ref={filterContentRef}>
                    <Filter
                        filters={filterGroups}
                        search={{
                            value: searchTerm,
                            onChange: setSearchTerm,
                            placeholder: "Zoek",
                        }}
                    />
                </div>
            </div>

            {children}
        </>
    );
}

import {useMemo, useState} from "react";

import type ITable from "../../types/compontents/ITable";
import type {ITableColumn, SortDirection} from "../../types/compontents/ITable";

export default function Table<T>({columns, rows, rowKey}: ITable<T>) {
    const [tooltipKey, setTooltipKey] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const sortedRows = useMemo(() => {
        if (!sortKey) return rows;

        const sorted = [...rows].sort((a, b) => {
            const valueA = String(a[sortKey as unknown as keyof T]);
            const valueB = String(b[sortKey as unknown as keyof T]);

            return valueA.localeCompare(valueB, undefined, {numeric: true, sensitivity: "base"});
        });

        return sortDirection === "asc" ? sorted : sorted.reverse();
    }, [rows, sortKey, sortDirection]);

    function getSortIndicator(column: ITableColumn<T>): string {
        if (column.sortable === false || sortKey !== String(column.key)) return "";

        return sortDirection === "asc" ? "^" : "⌄";
    }

    function handleHeaderClick(column: ITableColumn<T>) {
        if (column.sortable === false) return;

        const key = String(column.key);

        if (sortKey !== key) {
            setSortKey(key);
            setSortDirection("asc");
            return;
        }

        if (sortDirection === "asc") {
            setSortDirection("desc");
            return;
        }

        setSortKey(null);
        setSortDirection("asc");
    }

    function handleCellMouseEnter(event: React.MouseEvent<HTMLDivElement>, cellKey: string) {
        const {scrollWidth, clientWidth} = event.currentTarget;

        setTooltipKey(scrollWidth > clientWidth ? cellKey : null);
    }

    function renderCell(column: ITableColumn<T>, row: T) {
        const value = String(row[column.key as unknown as keyof T]);
        const content = column.render ? column.render(row) : value;
        const cellKey = `${String(row[rowKey])}-${String(column.key)}`;

        if (column.copyable === false) {
            return (
                <td key={String(column.key)} className="px-4 py-4 font-semibold">
                    {content}
                </td>
            );
        }

        return (
            <td key={String(column.key)} className="px-4 py-4 relative font-semibold">
                <div
                    onMouseEnter={event => handleCellMouseEnter(event, cellKey)}
                    onMouseLeave={() => setTooltipKey(null)}
                    onClick={event => navigator.clipboard.writeText(event.currentTarget.textContent ?? "")}
                    className="truncate cursor-pointer">
                    {content}
                </div>

                {tooltipKey === cellKey && (
                    <div
                        className="px-2 py-1 absolute top-full left-2 z-10 text-xs text-(--color-white)
                            bg-(--color-darkblue) rounded-md shadow-lg">
                        {value}
                    </div>
                )}
            </td>
        );
    }

    return (
        <div className="relative overflow-auto w-full h-full">
            <table className="table-fixed w-full text-sm text-left" id="data-table">
                <thead>
                    <tr className="sticky top-0 bg-(--color-lightwhite) rounded-lg">
                        {columns.map(column => (
                            <th
                                key={String(column.key)}
                                onClick={() => handleHeaderClick(column)}
                                className={`px-4 py-3 font-medium text-(--color-darkblue)/50 truncate ${
                                    column.sortable !== false ? "cursor-pointer select-none" : ""
                                }`}>
                                {column.label} {getSortIndicator(column)}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {sortedRows.map(row => (
                        <tr key={String(row[rowKey])}>{columns.map(column => renderCell(column, row))}</tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

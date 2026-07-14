import {useState} from "react";

import type ITable from "../../types/compontents/ITable";
import type {ITableColumn} from "../../types/compontents/ITable";

export default function Table<T>({columns, rows, rowKey}: ITable<T>) {
    const [tooltipKey, setTooltipKey] = useState<string | null>(null);

    function renderHeader(column: ITableColumn<T>) {
        return (
            <th key={String(column.key)} className="px-4 py-3 truncate font-medium text-(--color-darkblue)/50">
                {column.label}
            </th>
        );
    }

    function isTruncated(element: HTMLElement): boolean {
        return element.scrollWidth > element.clientWidth;
    }

    function handleCellMouseEnter(event: React.MouseEvent<HTMLDivElement>, cellKey: string) {
        const element = event.currentTarget;
        const truncated = isTruncated(element);

        element.style.cursor = truncated ? "pointer" : "";
        setTooltipKey(truncated ? cellKey : null);
    }

    function handleCellClick(event: React.MouseEvent<HTMLDivElement>, value: string) {
        if (isTruncated(event.currentTarget)) navigator.clipboard.writeText(value);
    }

    function renderCell(column: ITableColumn<T>, row: T) {
        if (column.render) {
            return (
                <td key={String(column.key)} className="px-4 py-4 truncate font-semibold">
                    {column.render(row)}
                </td>
            );
        }

        const value = String(row[column.key as unknown as keyof T]);
        const cellKey = `${String(row[rowKey])}-${String(column.key)}`;

        return (
            <td key={String(column.key)} className="relative px-4 py-4 font-semibold">
                <div
                    className="truncate"
                    onMouseEnter={event => handleCellMouseEnter(event, cellKey)}
                    onMouseLeave={() => setTooltipKey(null)}
                    onClick={event => handleCellClick(event, value)}>
                    {value}
                </div>

                {tooltipKey === cellKey && (
                    <div
                        className="absolute top-full left-2 z-10 rounded-md bg-(--color-darkblue) px-2 py-1 text-xs
                            text-(--color-white) shadow-lg">
                        {value}
                    </div>
                )}
            </td>
        );
    }

    function renderRow(row: T) {
        return <tr key={String(row[rowKey])}>{columns.map(column => renderCell(column, row))}</tr>;
    }

    return (
        <div className="relative overflow-auto h-full w-full">
            <table className="table-fixed w-full text-left text-sm">
                <thead>
                    <tr className="sticky top-0 rounded-lg bg-(--color-lightwhite)">{columns.map(renderHeader)}</tr>
                </thead>

                <tbody>{rows.map(renderRow)}</tbody>
            </table>
        </div>
    );
}

import type ITable from "../../types/compontents/ITable";
import type {ITableColumn} from "../../types/compontents/ITable";

export default function Table<T>({columns, rows, rowKey}: ITable<T>) {
    function renderHeader(column: ITableColumn<T>) {
        return (
            <th key={String(column.key)} className="px-4 py-3 truncate font-medium text-(--color-darkblue)/50">
                {column.label}
            </th>
        );
    }

    function renderCell(column: ITableColumn<T>, row: T) {
        const value = column.render ? column.render(row) : String(row[column.key as unknown as keyof T]);

        return (
            <td key={String(column.key)} className="px-4 py-4 truncate font-semibold">
                {value}
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

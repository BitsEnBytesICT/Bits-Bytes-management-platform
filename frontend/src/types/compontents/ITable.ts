import type {ReactNode} from "react";

export type SortDirection = "asc" | "desc";

export interface ITableColumn<T> {
    key: keyof T | string;
    label: string;
    render?: (row: T) => ReactNode;
    copyable?: boolean;
    sortable?: boolean;
}

export default interface ITable<T> {
    columns: ITableColumn<T>[];
    rows: T[];
    rowKey: keyof T;
}

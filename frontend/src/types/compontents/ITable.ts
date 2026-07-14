import type {ReactNode} from "react";

export interface ITableColumn<T> {
    key: keyof T | string;
    label: string;
    render?: (row: T) => ReactNode;
}

export default interface ITable<T> {
    columns: ITableColumn<T>[];
    rows: T[];
    rowKey: keyof T;
}

import type {ReactNode} from "react";

export type SortDirection = "asc" | "desc";

export interface ITableColumn<T> {
    key: keyof T | string;
    label: string;
    render?: (row: T) => ReactNode;
    copyable?: boolean;
    sortable?: boolean;
}

interface ITableBase<T> {
    columns: ITableColumn<T>[];
    rowKey: keyof T;
}

interface ITableUnchecked<T> extends ITableBase<T> {
    rows: T[];
    checkBox: false;
    setRows: (value: T[]) => void;
}

interface ITableChecked<T> extends ITableBase<T> {
    rows: (T & {checked: boolean})[];
    checkBox: true;
    setRows: (value: (T & {checked: boolean})[]) => void;
}

type ITable<T> = ITableUnchecked<T> | ITableChecked<T>;
export type {ITable as default};

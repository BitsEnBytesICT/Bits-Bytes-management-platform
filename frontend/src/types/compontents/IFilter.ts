export interface IFilterOption {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

export interface IFilterSearch {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default interface IFilter {
    filters: IFilterOption[];
    search?: IFilterSearch;
}

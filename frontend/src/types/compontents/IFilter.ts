export interface IFilterOption {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

export default interface IFilter {
    filters: IFilterOption[];
}

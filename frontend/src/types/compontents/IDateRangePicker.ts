export interface IDateRange {
    from: string;
    to: string;
}

export default interface IDateRangePicker {
    value: IDateRange;
    onChange: (value: IDateRange) => void;
}

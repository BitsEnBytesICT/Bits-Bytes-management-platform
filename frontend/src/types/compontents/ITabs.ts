export default interface ITabs {
    tabs: string[];
    active: number;
    onChange: (index: number) => void;
    classNameExtra?: string;
}

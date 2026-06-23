export default interface IButton {
    icon?: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}

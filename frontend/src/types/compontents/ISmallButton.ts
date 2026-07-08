export default interface ISmallButton {
    icon?: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}

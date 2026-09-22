export default interface ISmallButton {
    icon?: React.ReactNode;
    label: string;
    active?: boolean;
    pressed?: boolean;
    onClick?: () => void;
    classNameExtra?: string;
}

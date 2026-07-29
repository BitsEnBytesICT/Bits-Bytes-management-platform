import type {DocumentProps} from "@react-pdf/renderer";

export enum ButtonType {
    DOWNLOAD,
    REGULAR,
}

export default interface ISmallButton {
    icon?: React.ReactNode;
    label: string;
    active?: boolean;
    type?: ButtonType;
    document?: React.ReactElement<DocumentProps>;
    filename?: string;
    onClick?: () => void;
}

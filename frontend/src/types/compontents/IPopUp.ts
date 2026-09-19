import type {ReactNode} from "react";

export default interface IPopUp {
    onClose: () => void;
    button: ReactNode;
    title?: string;
    children: ReactNode[];
    errors: any[];
}

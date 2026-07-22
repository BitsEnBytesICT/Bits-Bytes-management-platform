import type {ReactNode} from "react";

export default interface IPopUp {
    onClose: () => void;
    title?: string;
    child: ReactNode;
}

import type {ReactNode} from "react";

export default interface IButton {
    children: ReactNode;
    onClick?: () => void;
}

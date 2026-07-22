import type {ReactNode} from "react";

export default interface IConfirmButton {
    children: ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary";
}

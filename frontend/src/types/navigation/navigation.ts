import type {JSX} from "react";

export interface NavigationItem {
    name: string;
    path: string;
    icon: string;
    page?: JSX.Element | JSX.Element[];
}

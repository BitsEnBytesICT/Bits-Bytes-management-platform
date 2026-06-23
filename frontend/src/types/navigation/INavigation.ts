import type {JSX} from "react";

export interface INavigationItem {
    name: string;
    path: string;
    icon: string;
    page?: JSX.Element | JSX.Element[];
}

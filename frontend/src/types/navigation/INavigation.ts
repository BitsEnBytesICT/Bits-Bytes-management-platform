import type {JSX} from "react";
import type {PermissionsList} from "../accounts/accountTypes";

export interface INavigationItem {
    name: string;
    path: string;
    icon: string;
    roles: PermissionsList[];
    page?: JSX.Element | JSX.Element[];
}

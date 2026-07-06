import { Roles } from "../permissions/rolesList";
import { PermissionsList } from "./accountTypes";

export default interface IAccount {
    id?: number,
    type: PermissionsList,
    firstname: string,
    lastname: string,
    role: Roles,
    password: string
}
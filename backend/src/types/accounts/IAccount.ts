import { Roles } from "../permissions/rolesList";

export default interface IAccount {
    id?: number,
    firstname: string,
    lastname: string,
    role: Roles,
    password: string
}
import { Roles } from "../permissions/rolesList";
import ICalendar from "./ICalendar";
import { PermissionsList } from "./accountTypes";

export default interface IAccount {
    id?: number,
    type: PermissionsList,
    firstname: string,
    lastname: string,
    username: string,
    role: Roles,
    password: string,
    calendars?: ICalendar[]
}
import {Roles} from "../permissions/rolesList";
import {PermissionsList} from "./accountTypes";
import type ICalendar from "./ICalendar";

export default interface IAccount {
    id?: number;
    type: PermissionsList;
    firstname: string;
    lastname: string;
    username: string;
    role: Roles;
    password: string;
    calendars?: ICalendar[];
}

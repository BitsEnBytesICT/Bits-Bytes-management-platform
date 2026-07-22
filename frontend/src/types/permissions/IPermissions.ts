import {PermissionsList} from "./permissionsList";
import {Roles} from "./rolesList";

export default interface IPermissions {
    id?: number;
    role: Roles;
    permissions: PermissionsList[];
}

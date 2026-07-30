import { Enforcer, newEnforcer } from "casbin";
import sleep from "./sleep";
import PermissionsService from "../endpoints/permissions/permissions.service";
import AccountService from "../endpoints/accounts/accounts.service";
import AuthService from "../endpoints/auth/auth.service";

let enforcerInstance: Enforcer;

export async function createEnforcer(): Promise<Enforcer> {
    if (!enforcerInstance) {
        console.log("Creating new Enforcer");
        enforcerInstance = await newEnforcer('./src/casbin/model.conf', './src/casbin/policy.csv');
        await BuildEnforcerPolicies();
    }
    return enforcerInstance;
}

export async function BuildEnforcerPolicies() {
    const permissionsSerivce = new PermissionsService();
    const accountService = new AccountService();
    const authService = new AuthService();
    try {
        console.log("Rebuilding Enforcer");
        enforcerInstance.clearPolicy();
        const RolesAndPermissions = await permissionsSerivce.list();
        for (const roleAndPermission of RolesAndPermissions) {
            for (const permission of roleAndPermission.permissions) {
                await enforcerInstance.addPermissionForUser(roleAndPermission.role, permission);
            }
        }
        const accounts = await accountService.list();
        for (const account of accounts) {
            await enforcerInstance.addRoleForUser(`${account.username}`, account.role);
        }
        const apikeys = await authService.listApiKeys();
        for (const key of apikeys) {
            const role = RolesAndPermissions.find((p) => p.id === key.permissionId)?.role;
            if (role) await enforcerInstance.addRoleForUser(key.apikey, role);
        }
    } catch (e) {
        console.log(e + "\nCannot make enforcer policies! Retrying in 5 seconds...");
        await sleep(5000);
        BuildEnforcerPolicies();
    }
}

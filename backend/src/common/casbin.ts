import { Enforcer, newEnforcer } from "casbin";
import sleep from "./sleep";
import PermissionsService from "../endpoints/permissions/permissions.service";

let enforcerInstance: Enforcer;

export async function createEnforcer(): Promise<Enforcer> {
    if (!enforcerInstance) {
        console.log("Creating new Enforcer");
        enforcerInstance = await newEnforcer('./src/casbin/model.conf', './src/casbin/policy.csv');
        BuildEnforcerPolicies();
    }
    return enforcerInstance;
}


export async function BuildEnforcerPolicies() {
    const permissionsSerivce = new PermissionsService();
    try {
        console.log("Rebuilding Enforcer");
        enforcerInstance.clearPolicy();
        const RolesAndPermissions = permissionsSerivce.list();
        for (var a = 0; a < RolesAndPermissions.length; a++) {
            for (var b = 0; b < RolesAndPermissions[a].permissions.length; b++) {
                await enforcerInstance.addPermissionForUser(RolesAndPermissions[a].role, RolesAndPermissions[a][b]);
            }
        }
        const users = await UserService.GetAll();
        for (var c = 0; c < users.length; c++) {
            await enforcerInstance.addRoleForUser(users[c].Email, users[c].Role);
        }
    } catch (e) {
        console.log(e + "\nCannot make enforcer policies!!!. Retrying in 5 seconds...");
        await sleep(5000);
        BuildEnforcerPolicies();
    }
}
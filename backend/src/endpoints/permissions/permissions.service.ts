import serviceBase from "../../common/serviceBase";
import IPermissions from "../../types/permissions/IPermissions";
import IPermissionsDB from "../../types/permissions/IPermissionsDB";
import { permissionsValidator } from "../../validators/PermissionsValidator";
import PermissionsDAO from "./permissions.dao";

export default class PermissionsService implements serviceBase<object> {
    dao: PermissionsDAO;

    constructor() {
        this.dao = new PermissionsDAO();
    }

    findOne(...args: never[]): object {
        throw new Error("Method not implemented.");
    }

    create(permissions: IPermissions): void {
        const validationResult = permissionsValidator(permissions);
        const errors = validationResult.filter((r) => r.kind === "error").map((error) => error.errorMSG);
        if (errors.length > 0) throw errors;

        let PermissionsDB: IPermissionsDB = {
            role: permissions.role,
            permissions: permissions.permissions.join(";")
        }
        this.dao.create(PermissionsDB);
    }

    update(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    list(): IPermissions[] {
        return this.dao.list().map((item) => 
            ({role: item.role, permissions: item.permissions.split(";").map((permission) => 
                permission)} as IPermissions));
    }
}
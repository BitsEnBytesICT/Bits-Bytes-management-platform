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

    async findOne(...args: never[]): Promise<object> {
        throw new Error("Method not implemented.");
    }

    async create(permissions: IPermissions) {
        const validationResult = permissionsValidator(permissions);
        const errors = validationResult.filter((r) => r.kind === "error").map((error) => error.errorMSG);
        if (errors.length > 0) throw errors;

        let PermissionsDB: IPermissionsDB = {
            role: permissions.role,
            permissions: permissions.permissions.join(";")
        }
        await this.dao.create(PermissionsDB);
    }

    async update(...args: any[]) {
        throw new Error("Method not implemented.");
    }

    async delete(...args: any[]) {
        throw new Error("Method not implemented.");
    }

    async list(): Promise<IPermissions[]> {
        return (await this.dao.list()).map((item) => 
            ({id: item.id, role: item.role, permissions: item.permissions.split(";").map((permission) => 
                permission)} as IPermissions));
    }
}
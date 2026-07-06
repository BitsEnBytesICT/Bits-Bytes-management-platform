import { daoBase, daoBaseType } from "../../common/daoBase";
import { dbAll, dbQuery } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import IPermissionsDB from "../../types/permissions/IPermissionsDB";

export default class PermissionsDAO extends daoBase<IPermissionsDB> implements daoBaseType<IPermissionsDB> {

    async findOne(...where: KeyValuePair<IPermissionsDB>[]): Promise<IPermissionsDB> {
        throw new Error("Method not implemented.");
    }
    async create(permissions: IPermissionsDB) {
        await dbQuery('INSERT INTO Permissions (role, permissions) VALUES (?, ?)', [permissions.role, permissions.permissions]);
    }
    update(...values: any[]): void {
        throw new Error("Method not implemented.");
    }
    delete(...where: any[]): void {
        throw new Error("Method not implemented.");
    }
    async list(): Promise<IPermissionsDB[]> {
        return await dbAll('SELECT * FROM Permissions');
    }   
}
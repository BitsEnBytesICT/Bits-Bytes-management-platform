import { daoBase, daoBaseType } from "../../common/daoBase";
import { dbAll, dbQuery } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import IPermissionsDB from "../../types/permissions/IPermissionsDB";

export default class PermissionsDAO extends daoBase<IPermissionsDB> implements daoBaseType<IPermissionsDB> {

    findOne(...args: KeyValuePair<IPermissionsDB>[]): IPermissionsDB {
        throw new Error("Method not implemented.");
    }
    create(permissions: IPermissionsDB): void {
        dbQuery('INSERT INTO Permissions (role, permissions) VALUES (?, ?)', [permissions.role, permissions.permissions]);
    }
    update(...args: any[]): void {
        throw new Error("Method not implemented.");
    }
    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }
    list(): IPermissionsDB[] {
        return dbAll('SELECT * FROM Permissions');
    }   
}
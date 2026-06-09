import daoBase from "../../common/daoBase";
import IPermissionsDB from "../../types/permissions/IPermissionsDB";

export default class PermissionsDAO implements daoBase<IPermissionsDB> {

    create(permissions: IPermissionsDB): void {
        throw new Error("Method not implemented.");
    }
    update(...args: any[]): void {
        throw new Error("Method not implemented.");
    }
    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }
    list(): IPermissionsDB[] {
        throw new Error("Method not implemented.");
    }   
}
import { daoBase, daoBaseType } from "../../common/daoBase";
import { dbAll } from "../../common/db";
import IApiKey from "../../types/apikeys/IApiKey";

export default class AuthDAO extends daoBase<any> implements daoBaseType<any> {

    async findOne(...args: any[]) {
        throw new Error("Method not implemented.");
    }

    async create(...args: any[]) {
        throw new Error("Method not implemented.");
    }

    update(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    async list(...args: any[]): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async listApiKeys() {
        return await dbAll<IApiKey>('SELECT * FROM ApiKeys');
    }
}
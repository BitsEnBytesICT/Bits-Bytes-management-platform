import { daoBase, daoBaseType } from "../../common/daoBase";
import { dbGet, dbQuery } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import ISignature from "../../types/signature/ISignature";
import { Tables } from "../../types/tables/tablesList";

export default class SignatureDao extends daoBase<ISignature> implements daoBaseType<ISignature> {
    async create(signature: ISignature) {
         await dbQuery('INSERT INTO Signatures (participantID, date, signature) VALUES (?, ?, ?)', [signature.participantID, signature.date, signature.signature]);
    }

    async update(where: KeyValuePair<ISignature>, ...args: KeyValuePair<ISignature>[]) {
        await this.updateFunc(Tables.Signatures, where, ...args);
    }

    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    async list(...args: any[]): Promise<ISignature[]> {
        throw new Error("Method not implemented.");
    }

    async findOne(...args: KeyValuePair<ISignature>[]): Promise<ISignature | undefined> {
        return await this.findOneFunc(Tables.Signatures, ...args);
    }
}
import { daoBase, daoBaseType } from "../../common/daoBase";
import { dbGet, dbQuery } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import ISignature from "../../types/signature/ISignature";


export default class SignatureDao extends daoBase<ISignature> implements daoBaseType<ISignature> {
    create(signature: ISignature): void {
         dbQuery('INSERT INTO Signatures (deelnemerID, date, signature) VALUES (?, ?, ?)', [signature.deelnemerID, signature.date, signature.signature]);
    }

    update(where: KeyValuePair<ISignature>, ...args: KeyValuePair<ISignature>[]): void {
        this.updateFunc("Signatures", where, ...args);
    }

    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    list(...args: any[]): ISignature[] {
        throw new Error("Method not implemented.");
    }

    findOne(...args: KeyValuePair<ISignature>[]): ISignature {
        return this.findOneFunc("Signatures", ...args);
    }
}
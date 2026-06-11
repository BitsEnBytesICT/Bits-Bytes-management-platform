import daoBase from "../../common/daoBase";
import { dbGet, dbQuery } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import ISignature from "../../types/signature/ISignature";


export default class SignatureDao implements daoBase<ISignature> {
    create(signature: ISignature): void {
         dbQuery('INSERT INTO Signatures (deelnemerID, date, signature) VALUES (?, ?, ?)', [signature.deelnemerID, signature.date, signature.signature]);
    }

    update(where: KeyValuePair<ISignature>, ...args: KeyValuePair<ISignature>[]): void {
        dbQuery(`UPDATE Signatures SET ${args.map(([key]) => 
            `${String(key)} = ?`).join(", ")} WHERE ${String(where[0])} = ?`, args.concat(where).map(([, value]) => value));
    }

    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    list(...args: any[]): ISignature[] {
        throw new Error("Method not implemented.");
    }

    findOne(...args: KeyValuePair<ISignature>[]): ISignature {
        return dbGet(`SELECT * FROM Signatures WHERE ${args.map(([key, value]) => 
        value === undefined ? `${String(key)} IS NULL` : `${String(key)} = ?`).join(" AND ")} LIMIT 1`, 
        args.filter(([, value]) => value !== undefined).map(([, value]) => value));
    }
}
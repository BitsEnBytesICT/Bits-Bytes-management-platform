import { daoBaseType, daoBase } from "../../common/daoBase";
import { dbGet, dbQuery } from "../../common/db";
import { KeyValuePair } from "../../common/Validator";
import IDeelnemer from "../../types/deelnemer/IDeelnemer";

export default class DeelnemerDao extends daoBase<IDeelnemer> implements daoBaseType<IDeelnemer> {
    create(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    update(where: KeyValuePair<IDeelnemer>, ...args: KeyValuePair<IDeelnemer>[]): void {
        this.updateFunc("Deelnemers", where, ...args);
    }

    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    list(...args: any[]): IDeelnemer[] {
        throw new Error("Method not implemented.");
    }

    findOne(...args: KeyValuePair<IDeelnemer>[]): IDeelnemer {
        return this.findOneFunc("Deelnemers", ...args);
    }
}
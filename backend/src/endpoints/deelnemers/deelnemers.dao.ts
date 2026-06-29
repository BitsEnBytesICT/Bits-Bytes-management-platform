import { daoBaseType, daoBase } from "../../common/daoBase";
import { KeyValuePair } from "../../common/Validator";
import IDeelnemer from "../../types/deelnemer/IDeelnemer";

export default class DeelnemerDao extends daoBase<IDeelnemer> implements daoBaseType<IDeelnemer> {
    create(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    async update(where: KeyValuePair<IDeelnemer>, ...values: KeyValuePair<IDeelnemer>[]) {
        await this.updateFunc("Deelnemers", where, ...values);
    }

    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    async list(...args: any[]): Promise<IDeelnemer[]> {
        throw new Error("Method not implemented.");
    }

    async findOne(...where: KeyValuePair<IDeelnemer>[]): Promise<IDeelnemer> {
        return await this.findOneFunc("Deelnemers", ...where);
    }
}
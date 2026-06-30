import { daoBaseType, daoBase } from "../../common/daoBase";
import { KeyValuePair } from "../../common/Validator";
import IParticipant from "../../types/participant/IParticipant";
import { Tables } from "../../types/tables/tablesList";

export default class ParticipantDao extends daoBase<IParticipant> implements daoBaseType<IParticipant> {
    create(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    async update(where: KeyValuePair<IParticipant>, ...values: KeyValuePair<IParticipant>[]) {
        await this.updateFunc(Tables.Participants, where, ...values);
    }

    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    async list(...args: any[]): Promise<IParticipant[]> {
        throw new Error("Method not implemented.");
    }

    async findOne(...where: KeyValuePair<IParticipant>[]): Promise<IParticipant> {
        return await this.findOneFunc(Tables.Participants, ...where);
    }
}
import serviceBase from "../../common/serviceBase";
import { KeyValuePair, ValidatorTuple } from "../../common/Validator";
import IParticipant from "../../types/participant/IParticipant";
import { participantValidatorFunctors, partialParticipantValidator } from "../../validators/participantValidator";
import ParticipantDao from "./participants.dao";

export default class ParticipantService implements serviceBase<IParticipant> {
    dao: ParticipantDao;

    constructor() {
        this.dao = new ParticipantDao();
    }

    async findOne(...where: KeyValuePair<IParticipant>[]): Promise<IParticipant> {
        return await this.dao.findOne(...where);
    }

    async create(...args: any[]) {
        throw new Error("Method not implemented.");
    }

    async update(where: KeyValuePair<IParticipant>, ...values: KeyValuePair<IParticipant>[]) {
        const validatorFunctors = values.map((item) => 
            [item[0], participantValidatorFunctors[item[0]][0], participantValidatorFunctors[item[0]][1]] as ValidatorTuple<IParticipant>);

        const validationResult = partialParticipantValidator(Object.fromEntries(values), validatorFunctors);
        const errors = validationResult.filter((r) => r.kind === "error").map((r) => r.errorMSG);
        if (errors.length > 0) throw errors;

        await this.dao.update(where, ...values);
    }
    
    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    async list(): Promise<IParticipant[]> {
        return await this.dao.list();
    }

    async count(): Promise<number> {
        return await this.dao.count();
    }

    async countPresent(): Promise<number> {
        return await this.dao.countPresent();
    }
}
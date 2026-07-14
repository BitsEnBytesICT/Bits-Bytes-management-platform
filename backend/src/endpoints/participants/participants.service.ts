import serviceBase from "../../common/serviceBase";
import { KeyValuePair, ValidatorTuple } from "../../common/Validator";
import { ErrorCodes } from "../../types/error/ErrorCodes";
import IError from "../../types/error/IError";
import IParticipant from "../../types/participant/IParticipant";
import { participantValidatorFunctors, partialParticipantValidator, ParticipantValidator } from "../../validators/participantValidator";
import ParticipantDao from "./participants.dao";

export default class ParticipantService implements serviceBase<IParticipant> {
    dao: ParticipantDao;

    constructor() {
        this.dao = new ParticipantDao();
    }

    async findOne(...where: KeyValuePair<IParticipant>[]): Promise<IParticipant | undefined> {
        return await this.dao.findOne(...where);
    }

    async create(participant: IParticipant) {
        if (!participant) throw {
            date: new Date(),
            errorMSG: new Error("no participant supplied"),
            code: ErrorCodes.InvalidData
        } satisfies IError

        const errors = ParticipantValidator(participant).filter((result) => result.kind === "error").map((r) => r.errorMSG);
        if (errors && errors.length > 0) throw errors;

        await this.dao.create(participant);
    }

    async update(where: KeyValuePair<IParticipant>, ...values: KeyValuePair<IParticipant>[]) {
        if (!where || !values) throw {
            date: new Date(),
            errorMSG: new Error("no values to update supplied or no where clause supplied"),
            code: ErrorCodes.InvalidData
        } satisfies IError

        const validatorFunctors = values.map((item) => 
            [item[0], participantValidatorFunctors[item[0]][0], participantValidatorFunctors[item[0]][1]] as ValidatorTuple<IParticipant>);

        const validationResult = partialParticipantValidator(Object.fromEntries(values), validatorFunctors);
        const errors = validationResult.filter((r) => r.kind === "error").map((r) => r.errorMSG);
        if (errors.length > 0) throw errors;

        await this.dao.update(where, ...values);
    }
    
    async delete(id: number) {
        await this.dao.delete(["id", id]);
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
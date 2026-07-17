import serviceBase from "../../common/serviceBase";
import { KeyValuePair, ValidatorTuple } from "../../common/Validator";
import IAccount from "../../types/accounts/IAccount";
import { ErrorCodes } from "../../types/error/ErrorCodes";
import IError from "../../types/error/IError";
import IParticipant from "../../types/participant/IParticipant";
import { participantValidatorFunctors, partialParticipantValidator, ParticipantValidator } from "../../validators/participantValidator";
import AccountService from "../accounts/accounts.service";
import ParticipantDao from "./participants.dao";

export default class ParticipantService implements serviceBase<IParticipant> {
    dao: ParticipantDao;
    accountService: AccountService;

    constructor() {
        this.dao = new ParticipantDao();
        this.accountService = new AccountService();
    }

    async findOne(...where: KeyValuePair<IParticipant>[]): Promise<IParticipant | undefined> {
        return await this.dao.findOne(...where);
    }

    async create(participant: IParticipant) {
        if (!participant) throw {
            date: new Date(),
            errorMSG: new Error("participant required"),
            code: ErrorCodes.InvalidData
        } satisfies IError

        const account = await this.accountService.findOne(["id", participant.account]);
        if (!account) throw {
            date: new Date(),
            errorMSG: new Error("account not found"),
            code: ErrorCodes.InvalidData
        } satisfies IError
        else if (account.firstname !== participant.firstname || account.lastname !== participant.lastname) throw {
            date: new Date(),
            errorMSG: new Error("firstname or lastname of the account and participant do not match"),
            code: ErrorCodes.InvalidData
        } satisfies IError

        const errors = ParticipantValidator(participant).filter((result) => result.kind === "error").map((r) => r.errorMSG);
        if (errors && errors.length > 0) throw errors;

        await this.dao.create(participant);
    }

    async update(where: KeyValuePair<IParticipant>, ...values: KeyValuePair<IParticipant>[]) {
        if (!where || !values) throw {
            date: new Date(),
            errorMSG: new Error("where clause and values are required"),
            code: ErrorCodes.InvalidData
        } satisfies IError

        if (values.map((value) => value[0]).includes("account")) {
            const participant = await this.findOne(where);
            const account = await this.accountService.findOne(["id", values.find((value) => value[0] === "account")?.[1]]);
            if (!account) throw {
                date: new Date(),
                errorMSG: new Error("account not found"),
                code: ErrorCodes.InvalidData
            } satisfies IError
            else if (account.firstname !== participant?.firstname || account.lastname !== participant?.lastname) throw {
                date: new Date(),
                errorMSG: new Error("firstname or lastname of the account and participant do not match"),
                code: ErrorCodes.InvalidData
            } satisfies IError
        }

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
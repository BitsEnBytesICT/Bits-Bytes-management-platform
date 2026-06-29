import serviceBase from "../../common/serviceBase";
import { KeyValuePair, ValidatorTuple } from "../../common/Validator";
import IDeelnemer from "../../types/deelnemer/IDeelnemer";
import { deelnemerValidatorFunctors, partialDeelnemerValidator } from "../../validators/deelnemerValidator";
import DeelnemerDao from "./deelnemers.dao";

export default class DeelnemerService implements serviceBase<IDeelnemer> {
    dao: DeelnemerDao;

    constructor() {
        this.dao = new DeelnemerDao();
    }

    async findOne(...where: KeyValuePair<IDeelnemer>[]): Promise<IDeelnemer> {
        return await this.dao.findOne(...where);
    }

    async create(...args: any[]) {
        throw new Error("Method not implemented.");
    }

    async update(where: KeyValuePair<IDeelnemer>, ...values: KeyValuePair<IDeelnemer>[]) {
        const validatorFunctors = values.map((item) => 
            [item[0], deelnemerValidatorFunctors[item[0]][0], deelnemerValidatorFunctors[item[0]][1]] as ValidatorTuple<IDeelnemer>);

        const validationResult = partialDeelnemerValidator(Object.fromEntries(values), validatorFunctors);
        const errors = validationResult.filter((r) => r.kind === "error").map((r) => r.errorMSG);
        if (errors.length > 0) throw errors;

        await this.dao.update(where, ...values);
    }
    
    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    async list(...args: any[]): Promise<IDeelnemer[]> {
        throw new Error("Method not implemented.");
    }
}
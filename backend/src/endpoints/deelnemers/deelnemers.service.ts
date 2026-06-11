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

    findOne(...args: KeyValuePair<IDeelnemer>[]): IDeelnemer {
        return this.dao.findOne(...args);
    }

    create(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    update(where: KeyValuePair<IDeelnemer>, ...args: KeyValuePair<IDeelnemer>[]): void {
        const validatorFunctors = args.map((item) => 
            [item[0], deelnemerValidatorFunctors[item[0]][0], deelnemerValidatorFunctors[item[0]][1]] as ValidatorTuple<IDeelnemer>);

        const validationResult = partialDeelnemerValidator(Object.fromEntries(args) as Partial<IDeelnemer>, validatorFunctors);
        const errors = validationResult.filter((r) => r.kind === "error").map((r) => r.errorMSG);
        if (errors.length > 0) throw errors;

        this.dao.update(where, ...args);
    }
    
    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    list(...args: any[]): IDeelnemer[] {
        throw new Error("Method not implemented.");
    }
}
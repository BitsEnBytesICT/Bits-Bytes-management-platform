import serviceBase from "../../common/serviceBase";
import { KeyValuePair, ValidatorTuple } from "../../common/Validator";
import ISignature from "../../types/signature/ISignature";
import { partialSignatureValidator, signatureValidator, signatureValidatorFunctors } from "../../validators/signatureValidator";
import SignatureDao from "./signatures.dao";

export default class SignatureService implements serviceBase<ISignature> {
    dao: SignatureDao;

    constructor() {
        this.dao = new SignatureDao();
    }

    create(signature: ISignature): void {
        const result = signatureValidator(signature);

        if (result.find((r) => r.kind === 'error') !== undefined) {
            const errors = result
                .filter((r) => r.kind === 'error')
                .map((error) => error.errorMSG);
            throw errors;
        }

        this.dao.create(signature);
    }

    update(where: KeyValuePair<ISignature>, ...args: KeyValuePair<ISignature>[]): void {
        const validatorFunctors = args.map((item) => 
                    [item[0], signatureValidatorFunctors[item[0]][0], signatureValidatorFunctors[item[0]][1]] as ValidatorTuple<ISignature>);
        
        const validationResult = partialSignatureValidator(Object.fromEntries(args), validatorFunctors);
        const errors = validationResult.filter((r) => r.kind === "error").map((r) => r.errorMSG);
        if (errors.length > 0) throw errors;

        this.dao.update(where, ...args);
    }

    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }

    list(...args: any[]): ISignature[] {
        throw new Error("Method not implemented.");
    }

    findOne(...args: KeyValuePair<ISignature>[]): ISignature {
        return this.dao.findOne(...args);
    }
}
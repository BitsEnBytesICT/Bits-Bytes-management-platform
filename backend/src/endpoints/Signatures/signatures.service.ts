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

    async create(signature: ISignature) {
        const result = signatureValidator(signature);

        if (result.find((r) => r.kind === 'error') !== undefined) {
            const errors = result
                .filter((r) => r.kind === 'error')
                .map((error) => error.errorMSG);
            throw errors;
        }

        await this.dao.create(signature);
    }

    async update(where: KeyValuePair<ISignature>, ...args: KeyValuePair<ISignature>[]) {
        const validatorFunctors = args.map((item) => 
                    [item[0], signatureValidatorFunctors[item[0]][0], signatureValidatorFunctors[item[0]][1]] as ValidatorTuple<ISignature>);
        
        const validationResult = partialSignatureValidator(Object.fromEntries(args), validatorFunctors);
        const errors = validationResult.filter((r) => r.kind === "error").map((r) => r.errorMSG);
        if (errors.length > 0) throw errors;

        await this.dao.update(where, ...args);
    }

    async delete(...args: any[]) {
        throw new Error("Method not implemented.");
    }

    async list(...args: any[]): Promise<ISignature[]> {
        throw new Error("Method not implemented.");
    }

    async findOne(...args: KeyValuePair<ISignature>[]): Promise<ISignature> {
        return await this.dao.findOne(...args);
    }
}
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import ISignature from '../types/signature/ISignature';
import { validateDate, validatePositiveNumber, validatePositiveNumberOrUndefined, validateStringNotEmpty } from './globalValidators';


export const signatureValidatorFunctors: ValidatorMap<ISignature> = {
    id: [validatePositiveNumberOrUndefined, "id is not valid"],
    participantID: [validatePositiveNumber, "participantID is required"],
    date: [validateDate, "date is not a valid date"],
    signature: [validateStringNotEmpty, "signature is required"]
}

export function signatureValidator(signature: ISignature) {
    const mappedValidators = (Object.keys(signatureValidatorFunctors) as Array<keyof ISignature>).map((key) => 
        [key, signatureValidatorFunctors[key][0], signatureValidatorFunctors[key][1]] as ValidatorTuple<ISignature>);
    return validatorPipe(signature, ...mappedValidators);
}

export function partialSignatureValidator(signature: Partial<ISignature>, mappedValidators: ValidatorTuple<ISignature>[]) {
    return validatorPipePartial(signature, ...mappedValidators);
}

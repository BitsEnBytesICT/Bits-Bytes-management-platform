import { Fun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import ISignature from '../types/signature/ISignature';

const validateNumber = Fun<number, boolean>(n => n > 0);
const validateNumberOrUndefined = Fun<number | undefined, boolean>(n => n === undefined ? true : n > 0);
const validateDate = Fun<string, boolean>(s => !isNaN(Date.parse(s)));
const validateString = Fun<string, boolean>(s => s.length > 0);

export const signatureValidatorFunctors: ValidatorMap<ISignature> = {
    id: [validateNumberOrUndefined, "id is not valid"],
    participantID: [validateNumber, "participantID is required"],
    date: [validateDate, "date is not a valid date"],
    signature: [validateString, "signature is required"]
}

export function signatureValidator(signature: ISignature) {
    const mappedValidators = (Object.keys(signatureValidatorFunctors) as Array<keyof ISignature>).map((key) => 
        [key, signatureValidatorFunctors[key][0], signatureValidatorFunctors[key][1]] as ValidatorTuple<ISignature>);
    return validatorPipe(signature, ...mappedValidators);
}

export function partialSignatureValidator(signature: Partial<ISignature>, mappedValidators: ValidatorTuple<ISignature>[]) {
    return validatorPipePartial(signature, ...mappedValidators);
}
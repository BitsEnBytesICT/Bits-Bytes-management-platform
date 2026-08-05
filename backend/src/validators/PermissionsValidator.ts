import { Fun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import IPermissions from "../types/permissions/IPermissions";
import { validatePositiveNumberOrUndefined, validateStringNotEmpty } from "./globalValidators";

const validateArrayLength = Fun<any[], boolean>((arr) => arr.length > 0);

export const permissionsValidatorFunctors: ValidatorMap<IPermissions> = {
    id: [validatePositiveNumberOrUndefined, "id is not valid"],
    role: [validateStringNotEmpty, "role cannot be empty"],
    permissions: [validateArrayLength, "permissions cannot be empty"]
}

export function permissionsValidator(signature: IPermissions) {
    const mappedValidators = (Object.keys(permissionsValidatorFunctors) as Array<keyof IPermissions>).map((key) => 
        [key, permissionsValidatorFunctors[key][0], permissionsValidatorFunctors[key][1]] as ValidatorTuple<IPermissions>);
    return validatorPipe(signature, ...mappedValidators);
}

export function partialpermissionsValidator(signature: Partial<IPermissions>, mappedValidators: ValidatorTuple<IPermissions>[]) {
    return validatorPipePartial(signature, ...mappedValidators);
}

import { validatorFun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import IPermissions from "../types/permissions/IPermissions";
import { PermissionsList } from "../types/permissions/permissionsList";
import { Roles } from "../types/permissions/rolesList";
import { validateNotNegativeNumber, validateNumberUndefined } from "./globalValidators";

const validateArrayLength = validatorFun<PermissionsList[]>((arr) => arr.length > 0);
const validateRole = validatorFun<Roles>((str) => Object.values(Roles).includes(str as Roles));

export const permissionsValidatorFunctors: ValidatorMap<IPermissions> = {
    id: [validateNumberUndefined.or(validateNotNegativeNumber), "id is not valid"],
    role: [validateRole, "role cannot be empty"],
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

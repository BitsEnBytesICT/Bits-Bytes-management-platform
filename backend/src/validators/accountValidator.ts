import { Fun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import { PermissionsList } from "../types/accounts/accountTypes";
import IAccount from "../types/accounts/IAccount";
import { Roles } from "../types/permissions/rolesList";
import { validateNotNegativeOrUndefined, validateStringNotEmpty, validateStringNotEmptyAndLenBelow50Char } from "./globalValidators";

const validateType = Fun<PermissionsList, boolean>((str) => Object.values(PermissionsList).includes(str as PermissionsList));
const validateRole = Fun<Roles, boolean>((str) => Object.values(Roles).includes(str as Roles));


export const accountValidatorFunctors: ValidatorMap<IAccount> = {
    id: [validateNotNegativeOrUndefined, "id cannot be negative"],
    firstname: [validateStringNotEmptyAndLenBelow50Char, "firstname cannot be empty or above 50 chars"],
    lastname: [validateStringNotEmptyAndLenBelow50Char, "lastname cannot be empty or above 50 chars"],
    type: [validateType, "type value does not exist in PermissionsList"],
    username: [validateStringNotEmptyAndLenBelow50Char, "username cannot be empty or above 50 chars"],
    password: [validateStringNotEmpty, "password cannot be empty"],
    role: [validateRole, "role value does not exist in roles"]
}

export function AccountValidator(account: IAccount) {
    const mappedValidators = (Object.keys(accountValidatorFunctors) as Array<keyof IAccount>).map((key) => 
        [key, accountValidatorFunctors[key][0], accountValidatorFunctors[key][1]] as ValidatorTuple<IAccount>);
    return validatorPipe(account, ...mappedValidators);
}

export function partialAccountValidator(account: Partial<IAccount>, mappedValidators: ValidatorTuple<IAccount>[]) {
    return validatorPipePartial(account, ...mappedValidators);
}

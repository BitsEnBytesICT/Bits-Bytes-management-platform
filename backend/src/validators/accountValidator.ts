import { validatorFun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import { PermissionsList } from "../types/accounts/accountTypes";
import IAccount from "../types/accounts/IAccount";
import ICalendar from "../types/accounts/ICalendar";
import IShortcut from "../types/accounts/IShortcut";
import { Roles } from "../types/permissions/rolesList";
import { validateLenBelow50, validateNotNegativeNumber, validateNumberUndefined, validateStringEmpty, validateStringNotEmpty } from "./globalValidators";

const validateType = validatorFun<PermissionsList>((str) => Object.values(PermissionsList).includes(str as PermissionsList));
const validateRole = validatorFun<Roles>((str) => Object.values(Roles).includes(str as Roles));
const validateLabelAndUrl = (items: (ICalendar | IShortcut)[] | undefined): boolean => items === undefined || (Array.isArray(items)
    && items.every((item) => typeof item?.label === "string" && item.label.length > 0 && item.label.length < 51
        && typeof item?.url === "string" && item.url.length > 0));

const validateCalendars = validatorFun<ICalendar[] | undefined>(validateLabelAndUrl);
const validateShortcuts = validatorFun<IShortcut[] | undefined>(validateLabelAndUrl);

export const accountValidatorFunctors: ValidatorMap<IAccount> = {
    id: [validateNumberUndefined.or(validateNotNegativeNumber), "id cannot be negative"],
    firstname: [validateStringNotEmpty.and(validateLenBelow50), "firstname cannot be empty or above 50 chars"],
    prefix: [validateStringEmpty.or(validateStringNotEmpty.and(validateLenBelow50)), "prefix cannot be above 50 chars"],
    lastname: [validateStringNotEmpty.and(validateLenBelow50), "lastname cannot be empty or above 50 chars"],
    type: [validateType, "type value does not exist in PermissionsList"],
    username: [validateStringNotEmpty.and(validateLenBelow50), "username cannot be empty or above 50 chars"],
    password: [validateStringNotEmpty, "password cannot be empty"],
    role: [validateRole, "role value does not exist in roles"],
    calendars: [validateCalendars, "calendars must be a list of a label and a url"],
    shortcuts: [validateShortcuts, "shortcuts must be a list of a label and a url"]
}

export function AccountValidator(account: IAccount) {
    const mappedValidators = (Object.keys(accountValidatorFunctors) as Array<keyof IAccount>).map((key) => 
        [key, accountValidatorFunctors[key][0], accountValidatorFunctors[key][1]] as ValidatorTuple<IAccount>);
    return validatorPipe(account, ...mappedValidators);
}

export function partialAccountValidator(account: Partial<IAccount>, mappedValidators: ValidatorTuple<IAccount>[]) {
    return validatorPipePartial(account, ...mappedValidators);
}

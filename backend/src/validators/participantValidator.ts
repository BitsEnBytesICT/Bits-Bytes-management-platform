import { Fun, validatorFun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import IParticipant from "../types/participant/IParticipant";
import { validateDate, validateLenBelow50, validateNotNegativeOrUndefined, validatePositiveNumber, validateStringNotEmpty, validateStringUndefinedOrLenBelow50CharAndUndefined } from "./globalValidators";

const validateOneorZero = validatorFun<number>(id => id === 0 || id === 1);
const validateOneorZeroUndefined = validatorFun<number | undefined>(id => id === undefined ? true : id === 0 || id === 1);
const validateBirthdayOrUndefined = validatorFun<string | undefined>(value => {
    if (value === undefined) return true;
    if (typeof value !== "string" || value.length !== 5 || !/^\d{2}-\d{2}$/.test(value)) return false;

    const day = Number(value.slice(0, 2));
    const month = Number(value.slice(3, 5));
    // Without a birth year, February 29 is a valid birthday.
    const maxDay = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0;

    return day >= 1 && day <= maxDay;
});

const validateOnlyutf8Andbasicspecialchars = validatorFun<string>(value => /^[\p{L} '’-]+$/u.test(value));

export const participantValidatorFunctors: ValidatorMap<IParticipant> = {
    id: [validateNotNegativeOrUndefined, "id cannot be negative"],
    firstname: [validateStringNotEmpty.then(validateOnlyutf8Andbasicspecialchars).then(validateLenBelow50), "firstname cannot be empty or above 50 chars and can not contain numbers or special characters"],
    prefix: [validateStringUndefinedOrLenBelow50CharAndUndefined, "prefix cannot be above 50 chars"],
    lastname: [validateStringNotEmpty.then(validateOnlyutf8Andbasicspecialchars).then(validateLenBelow50), "lastname cannot be empty or above 50 chars and can not contain numbers or special characters"],
    organisation: [validateStringNotEmpty.then(validateLenBelow50), "organisation cannot be empty or above 50 chars"],
    account: [validatePositiveNumber, "account id cannot be negative"],
    rfid: [validateStringNotEmpty.then(validateLenBelow50), "rfid cannot be empty or above 50 chars"],
    createdAt: [validateDate, "createdAt time is not valid"],
    active: [validateOneorZero, "active can only be a one or a zero"],
    clockedin: [validateOneorZeroUndefined, "clockin state can only be a one or a zero"],
    financing: [validateStringUndefinedOrLenBelow50CharAndUndefined, "financing cannot be above 50 chars"],
    bday: [validateBirthdayOrUndefined, "bday must be a valid date in dd-mm format"]
}

export function ParticipantValidator(participant: IParticipant) {
    const mappedValidators = (Object.keys(participantValidatorFunctors) as Array<keyof IParticipant>).map((key) => 
        [key, participantValidatorFunctors[key][0], participantValidatorFunctors[key][1]] as ValidatorTuple<IParticipant>);
    return validatorPipe(participant, ...mappedValidators);
}

export function partialParticipantValidator(participant: Partial<IParticipant>, mappedValidators: ValidatorTuple<IParticipant>[]) {
    return validatorPipePartial(participant, ...mappedValidators);
}

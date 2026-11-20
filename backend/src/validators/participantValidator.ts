import { validatorFun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import IParticipant from "../types/participant/IParticipant";
import { validateDate, validateLenBelow50, validateNotNegativeNumber, validateNumberUndefined, validateStringEmpty, validateStringNotEmpty, validateStringUndefined } from "./globalValidators";

const validateOneorZero = validatorFun<number>(id => id === 0 || id === 1);
const validateOneorZeroUndefined = validatorFun<number | undefined>(id => id === undefined ? true : id === 0 || id === 1);
const validateBirthday = validatorFun<string>(value => {
    if (typeof value !== "string" || value.length !== 5 || !/^\d{2}-\d{2}$/.test(value)) return false;

    const day = Number(value.slice(0, 2));
    const month = Number(value.slice(3, 5));
    // Without a birth year, February 29 is a valid birthday.
    const maxDay = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0;

    return day >= 1 && day <= maxDay;
});

const validateOnlyutf8Andbasicspecialchars = validatorFun<string>(value => /^[\p{L} '’-]+$/u.test(value));

export const participantValidatorFunctors: ValidatorMap<IParticipant> = {
    id: [validateNumberUndefined.or(validateNotNegativeNumber), "id cannot be negative"],
    firstname: [validateStringNotEmpty.and(validateOnlyutf8Andbasicspecialchars).and(validateLenBelow50), "firstname cannot be empty or above 50 chars and can not contain numbers or special characters"],
    prefix: [validateStringEmpty.or(validateStringNotEmpty.and(validateLenBelow50)), "prefix cannot be above 50 chars"],
    lastname: [validateStringNotEmpty.and(validateOnlyutf8Andbasicspecialchars).and(validateLenBelow50), "lastname cannot be empty or above 50 chars and can not contain numbers or special characters"],
    organisation: [validateStringNotEmpty.and(validateLenBelow50), "organisation cannot be empty or above 50 chars"],
    account: [validateNotNegativeNumber, "account id cannot be negative"],
    rfid: [validateStringNotEmpty.and(validateLenBelow50), "rfid cannot be empty or above 50 chars"],
    createdAt: [validateDate, "createdAt time is not valid"],
    active: [validateOneorZero, "active can only be a one or a zero"],
    clockedin: [validateOneorZeroUndefined, "clockin state can only be a one or a zero"],
    financing: [validateStringEmpty.or(validateStringNotEmpty.and(validateLenBelow50)), "financing cannot be above 50 chars"],
    bday: [validateStringUndefined.or(validateBirthday), "bday must be a valid date in dd-mm format"]
}

export function ParticipantValidator(participant: IParticipant) {
    const mappedValidators = (Object.keys(participantValidatorFunctors) as Array<keyof IParticipant>).map((key) => 
        [key, participantValidatorFunctors[key][0], participantValidatorFunctors[key][1]] as ValidatorTuple<IParticipant>);
    return validatorPipe(participant, ...mappedValidators);
}

export function partialParticipantValidator(participant: Partial<IParticipant>, mappedValidators: ValidatorTuple<IParticipant>[]) {
    return validatorPipePartial(participant, ...mappedValidators);
}

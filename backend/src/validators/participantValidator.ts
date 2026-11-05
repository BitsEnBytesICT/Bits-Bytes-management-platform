import { Fun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import IParticipant from "../types/participant/IParticipant";
import { validateDate, validateNotNegativeOrUndefined, validateStringNotEmptyAndLenBelow50Char } from "./globalValidators";

const validateNotNegative = Fun<number, boolean>(id => id >= 0);
const validateOneorZero = Fun<number, boolean>(id => id === 0 || id === 1);
const validateOneorZeroUndefined = Fun<number | undefined, boolean>(id => id === undefined ? true : id === 0 || id === 1);
const validateStringNotEmptyAndLenBelow50CharAndUndefined = Fun<string | undefined, boolean>(str => str === undefined ? true : str.length > 0 && str.length < 51);
const validateBirthdayOrUndefined = Fun<string | undefined, boolean>(value => {
    if (value === undefined) return true;
    if (typeof value !== "string" || value.length !== 5 || !/^\d{2}-\d{2}$/.test(value)) return false;

    const day = Number(value.slice(0, 2));
    const month = Number(value.slice(3, 5));
    // Without a birth year, February 29 is a valid birthday.
    const maxDay = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0;

    return day >= 1 && day <= maxDay;
});
const validateNotANumberNotEmptyAndLenBelow50 = Fun<string, boolean>(value => value.length > 0 && value.length < 51 && /^[\p{L} '’-]+$/u.test(value));

export const participantValidatorFunctors: ValidatorMap<IParticipant> = {
    id: [validateNotNegativeOrUndefined, "id cannot be negative"],
    firstname: [validateNotANumberNotEmptyAndLenBelow50, "firstname cannot be empty or above 50 chars and can not contain numbers or special characters"],
    lastname: [validateNotANumberNotEmptyAndLenBelow50, "lastname cannot be empty or above 50 chars and can not contain numbers or special characters"],
    organisation: [validateStringNotEmptyAndLenBelow50Char, "organisation cannot be empty or above 50 chars"],
    account: [validateNotNegative, "account id cannot be negative"],
    rfid: [validateStringNotEmptyAndLenBelow50Char, "rfid cannot be empty or above 50 chars"],
    createdAt: [validateDate, "createdAt time is not valid"],
    active: [validateOneorZero, "active can only be a one or a zero"],
    clockedin: [validateOneorZeroUndefined, "clockin state can only be a one or a zero"],
    financing: [validateStringNotEmptyAndLenBelow50CharAndUndefined, "financing cannot be above 50 chars"],
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

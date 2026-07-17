import { Fun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import IParticipant from "../types/participant/IParticipant";

const validateNotNegativeOrUndefined = Fun<number | undefined, boolean>(id => id === undefined ? true : id >= 0);
const validateNotNegative = Fun<number, boolean>(id => id >= 0);
const validateDate = Fun<string, boolean>(s => !isNaN(Date.parse(s)));
const validateOneorZero = Fun<number, boolean>(id => id === 0 || id === 1);
const validateOneorZeroUndefined = Fun<number | undefined, boolean>(id => id === undefined ? true : id === 0 || id === 1);
const validateStringNotEmptyAndLenBelow50Char = Fun<string, boolean>(str => str.length > 0 && str.length < 51);
const validateStringNotEmptyAndLenBelow50CharAndUndefined = Fun<string | undefined, boolean>(str => str === undefined ? true : str.length > 0 && str.length < 51);

export const participantValidatorFunctors: ValidatorMap<IParticipant> = {
    id: [validateNotNegativeOrUndefined, "id cannot be negative"],
    firstname: [validateStringNotEmptyAndLenBelow50Char, "firstname cannot be empty or above 50 chars"],
    lastname: [validateStringNotEmptyAndLenBelow50Char, "lastname cannot be empty or above 50 chars"],
    organisation: [validateStringNotEmptyAndLenBelow50Char, "organisation cannot be empty or above 50 chars"],
    account: [validateNotNegative, "account id cannot be negative"],
    rfid: [validateStringNotEmptyAndLenBelow50Char, "rfid cannot be empty or above 50 chars"],
    createdAt: [validateDate, "createdAt time not valid"],
    active: [validateOneorZero, "active can only be a one or a zero"],
    clockedin: [validateOneorZeroUndefined, "clockin state can only be a one or a zero"],
    financing: [validateStringNotEmptyAndLenBelow50CharAndUndefined, "financing cannot be above 50 chars"]
}

export function ParticipantValidator(participant: IParticipant) {
    const mappedValidators = (Object.keys(participantValidatorFunctors) as Array<keyof IParticipant>).map((key) => 
        [key, participantValidatorFunctors[key][0], participantValidatorFunctors[key][1]] as ValidatorTuple<IParticipant>);
    return validatorPipe(participant, ...mappedValidators);
}

export function partialParticipantValidator(participant: Partial<IParticipant>, mappedValidators: ValidatorTuple<IParticipant>[]) {
    return validatorPipePartial(participant, ...mappedValidators);
}
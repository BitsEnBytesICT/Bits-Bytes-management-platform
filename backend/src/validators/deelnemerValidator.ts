import { Fun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import IDeelnemer from "../types/deelnemer/IDeelnemer";

const validateStringNotEmpty = Fun<string | undefined, boolean>(str => str === undefined ? true : str.length > 0);
const validateAbove0 = Fun<number, boolean>(id => id > 0);
const validateAbove0OrUndefined = Fun<number | undefined, boolean>(id => id === undefined ? true : id > 0);
const validateDate = Fun<string, boolean>(s => !isNaN(Date.parse(s)));
const validateOneorZero = Fun<number, boolean>(id => id === 0 || id === 1);
const validateOneorZeroUndefined = Fun<number | undefined, boolean>(id => id === undefined ? true : id === 0 || id === 1);

export const deelnemerValidatorFunctors: ValidatorMap<IDeelnemer> = {
    id: [validateAbove0OrUndefined, "id is not valid"],
    firstname: [validateStringNotEmpty, "name cannot be empty"],
    lastname: [validateStringNotEmpty, "lastname cannot be empty"],
    organisation: [validateStringNotEmpty, "age is not valid"],
    account: [validateAbove0, "ivalid account id"],
    rfid: [validateStringNotEmpty, "rfid cannot be empty"],
    createdAt: [validateDate, "createdAt time not valid"],
    active: [validateOneorZero, "active can only be a one or a zero"],
    clockedin: [validateOneorZeroUndefined, "clockin state can only be a one or a zero"],
    product: [validateStringNotEmpty, "product cannot be empty"]
}

export function deelnemerValidator(deelnemer: IDeelnemer) {
    const mappedValidators = (Object.keys(deelnemerValidatorFunctors) as Array<keyof IDeelnemer>).map((key) => 
        [key, deelnemerValidatorFunctors[key][0], deelnemerValidatorFunctors[key][1]] as ValidatorTuple<IDeelnemer>);
    return validatorPipe(deelnemer, ...mappedValidators);
}

export function partialDeelnemerValidator(deelnemer: Partial<IDeelnemer>, mappedValidators: ValidatorTuple<IDeelnemer>[]) {
    return validatorPipePartial(deelnemer, ...mappedValidators);
}
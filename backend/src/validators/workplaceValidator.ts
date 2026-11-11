import { validatorFun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import { IWorkplace } from "../types/floorPlans/IWorkplace";
import { identityValidator, validateLenBelow100, validateNotNegativeNumber, validateNumberUndefined, validatePositiveNumber, validateStringNotEmpty } from "./globalValidators";

const validateRotation = validatorFun<0 | 90 | undefined>(value => value === undefined || value === 0 || value === 90);

export const workplaceValidatorFunctors: ValidatorMap<IWorkplace> = {
    id: [validateNumberUndefined.or(validateNotNegativeNumber), "id must be a positive integer"],
    name: [validateStringNotEmpty.and(validateLenBelow100), "name cannot be empty or above 100 chars"],
    xpos: [validateNotNegativeNumber, "xpos cannot be negative"],
    ypos: [validateNotNegativeNumber, "ypos cannot be negative"],
    RoomID: [validatePositiveNumber, "roomID cannot be less than 1"],
    extraInfo: [identityValidator, ""],
    rotation: [validateRotation, "rotation can only be undefined, 0 or 90"]
};

export function workplaceValidator(schedule: IWorkplace) {
    const mappedValidators = (Object.keys(workplaceValidatorFunctors) as Array<keyof IWorkplace>).map(key =>
        [key, workplaceValidatorFunctors[key][0], workplaceValidatorFunctors[key][1]] as ValidatorTuple<IWorkplace>);
    const results = validatorPipe(schedule, ...mappedValidators);

    return results;
}

export function partialWorkplaceValidator(schedule: Partial<IWorkplace>, mappedValidators: ValidatorTuple<IWorkplace>[]) {
    return validatorPipePartial(schedule, ...mappedValidators);
}

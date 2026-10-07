import { Fun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import { IWorkplace } from "../types/floorPlans/IWorkplace";
import { identityValidator, validateNotNegativeNumber, validatePositiveNumber } from "./globalValidators";

const validateId = Fun<number, boolean>(value => Number.isInteger(value) && value > 0 && value <= 4294967295);
const validateIdOrUndefined = Fun<number | undefined, boolean>(value => value === undefined || validateId(value));
const validateName = Fun<string, boolean>(value => typeof value === "string" && value.trim().length > 0 && value.length <= 255);
const validateRotation = Fun<number | undefined, boolean>(value => value === undefined || value === 0 || value === 90);

export const workplaceValidatorFunctors: ValidatorMap<IWorkplace> = {
    id: [validateIdOrUndefined, "id must be a positive integer"],
    name: [validateName, "name cannot be empty or above 255 chars"],
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

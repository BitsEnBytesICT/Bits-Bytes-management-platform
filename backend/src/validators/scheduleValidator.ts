import { Fun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import ISchedule from "../types/schedules/ISchedule";
import { validateDate } from "./globalValidators";

const validateId = Fun<number, boolean>(value => Number.isInteger(value) && value > 0 && value <= 4294967295);
const validateIdOrUndefined = Fun<number | undefined, boolean>(value => value === undefined || validateId(value));
const validateOptionalWorkplace = Fun<number | null | undefined, boolean>(value => value == null || validateId(value));
const validateName = Fun<string, boolean>(value => typeof value === "string" && value.trim().length > 0 && value.length <= 255);
const validateScheduleDate = Fun<string, boolean>(value => typeof value === "string" && validateDate(value));
const validateOptionalDate = Fun<string | null | undefined, boolean>(value => value == null || validateScheduleDate(value));

export const scheduleValidatorFunctors: ValidatorMap<ISchedule> = {
    id: [validateIdOrUndefined, "id must be a positive integer"],
    name: [validateName, "name cannot be empty or above 255 chars"],
    startDate: [validateScheduleDate, "startDate must be a valid date in YYYY-MM-DD HH:mm:ss format"],
    participant: [validateId, "participant must be a positive integer"],
    endDate: [validateOptionalDate, "endDate must be a valid date in YYYY-MM-DD HH:mm:ss format"],
    monMorning: [validateOptionalWorkplace, "monMorning must be a positive workplace id or null"],
    monEvening: [validateOptionalWorkplace, "monEvening must be a positive workplace id or null"],
    thuesMorning: [validateOptionalWorkplace, "thuesMorning must be a positive workplace id or null"],
    thuesEvening: [validateOptionalWorkplace, "thuesEvening must be a positive workplace id or null"],
    wedMorning: [validateOptionalWorkplace, "wedMorning must be a positive workplace id or null"],
    wedEvening: [validateOptionalWorkplace, "wedEvening must be a positive workplace id or null"],
    thursMorning: [validateOptionalWorkplace, "thursMorning must be a positive workplace id or null"],
    thursEvening: [validateOptionalWorkplace, "thursEvening must be a positive workplace id or null"],
    friMorning: [validateOptionalWorkplace, "friMorning must be a positive workplace id or null"],
    friEvening: [validateOptionalWorkplace, "friEvening must be a positive workplace id or null"],
};

export function scheduleValidator(schedule: ISchedule) {
    const mappedValidators = (Object.keys(scheduleValidatorFunctors) as Array<keyof ISchedule>).map(key =>
        [key, scheduleValidatorFunctors[key][0], scheduleValidatorFunctors[key][1]] as ValidatorTuple<ISchedule>);
    const results = validatorPipe(schedule, ...mappedValidators);

    return results;
}

export function partialScheduleValidator(schedule: Partial<ISchedule>, mappedValidators: ValidatorTuple<ISchedule>[]) {
    return validatorPipePartial(schedule, ...mappedValidators);
}

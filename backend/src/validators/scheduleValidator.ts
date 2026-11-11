import { Fun, validatorFun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import ISchedule from "../types/schedules/ISchedule";
import { validateDate } from "./globalValidators";

const validateId = validatorFun<number>(value => Number.isInteger(value) && value > 0 && value <= 4294967295);
const validateIdOrUndefined = validatorFun<number | undefined>(value => value === undefined || validateId(value)[1]);
const validateOptionalWorkplace = validatorFun<number | null | undefined>(value => value == null || validateId(value)[1]);
const validateName = validatorFun<string>(value => typeof value === "string" && value.trim().length > 0 && value.length <= 255);
const validateScheduleDate = validatorFun<string>(value => typeof value === "string" && validateDate(value)[1]);
const validateOptionalDate = validatorFun<string | null | undefined>(value => value == null || validateScheduleDate(value)[1]);

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

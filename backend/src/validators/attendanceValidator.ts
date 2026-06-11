import { Fun } from "../common/functor";
import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import IAttendance from '../types/attendance/IAttendance';

const validateNumber = Fun<number, boolean>(n => n > 0);
const validateNumberOrZero = Fun<number | undefined, boolean>(n => n === undefined ? true : n >= 0);
const validateNumberOrUndefined = Fun<number | undefined, boolean>(n => n === undefined ? true : n > 0);
const validateDate = Fun<string, boolean>(s => !isNaN(Date.parse(s)));
const validateDateOrUndefined = Fun<string | undefined, boolean>(s => s === undefined ? true : !isNaN(Date.parse(s)));

export const attendanceValidatorFunctors: ValidatorMap<IAttendance> = {
    id: [validateNumberOrUndefined, "id is not valid"],
    deelnemerID: [validateNumber, "deelnemerID is required"],
    clockinDate: [validateDate, "clockinDate is not a valid date"],
    clockoutDate: [validateDateOrUndefined, "clockoutDate is not a valid date"],
    workDuration: [validateNumberOrZero, "workDuration is not valid"]
}

export function attendanceValidator(signature: IAttendance) {
    const mappedValidators = (Object.keys(attendanceValidatorFunctors) as Array<keyof IAttendance>).map((key) => 
        [key, attendanceValidatorFunctors[key][0], attendanceValidatorFunctors[key][1]] as ValidatorTuple<IAttendance>);
    return validatorPipe(signature, ...mappedValidators);
}

export function partialAttendanceValidator(attendance: Partial<IAttendance>, mappedValidators: ValidatorTuple<IAttendance>[]) {
    return validatorPipePartial(attendance, ...mappedValidators);
}
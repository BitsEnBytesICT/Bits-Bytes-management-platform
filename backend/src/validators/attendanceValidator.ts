import { ValidatorMap, validatorPipe, validatorPipePartial, ValidatorTuple } from "../common/Validator";
import IAttendance from '../types/attendance/IAttendance';
import { validateDate, validateDateOrUndefined, validateNotNegativeOrUndefined, validatePositiveNumber, validatePositiveNumberOrUndefined, validateStringNotEmpty } from './globalValidators';


export const attendanceValidatorFunctors: ValidatorMap<IAttendance> = {
    id: [validatePositiveNumberOrUndefined, "id is not valid"],
    participantID: [validatePositiveNumber, "participantID is required"],
    clockinDate: [validateDate, "clockinDate is not a valid date"],
    clockoutDate: [validateDateOrUndefined, "clockoutDate is not a valid date"],
    workDuration: [validateNotNegativeOrUndefined, "workDuration is not valid"],
    signature: [validateStringNotEmpty, "signature is required"]
}

export function attendanceValidator(signature: IAttendance) {
    const mappedValidators = (Object.keys(attendanceValidatorFunctors) as Array<keyof IAttendance>).map((key) => 
        [key, attendanceValidatorFunctors[key][0], attendanceValidatorFunctors[key][1]] as ValidatorTuple<IAttendance>);
    return validatorPipe(signature, ...mappedValidators);
}

export function partialAttendanceValidator(attendance: Partial<IAttendance>, mappedValidators: ValidatorTuple<IAttendance>[]) {
    return validatorPipePartial(attendance, ...mappedValidators);
}

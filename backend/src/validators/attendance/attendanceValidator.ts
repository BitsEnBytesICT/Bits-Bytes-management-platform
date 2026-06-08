import { Fun } from "../../common/functor";
import { validatorPipe } from "../../common/Validator";
import IAttendance from '../../types/attendance/IAttendance';

const validateNumber = Fun<number, boolean>(n => n > 0);
const validateNumberOrZero = Fun<number | undefined, boolean>(n => n === undefined ? true : n >= 0);
const validateNumberOrUndefined = Fun<number | undefined, boolean>(n => n === undefined ? true : n > 0);
const validateString = Fun<string, boolean>(s => s.length > 0);
const validateStringOrUndefined = Fun<string | undefined, boolean>(s => s === undefined ? true : s.length > 0);

export default function attendanceValidator(attendance: IAttendance) {
    return validatorPipe(attendance,
        ["id", validateNumberOrUndefined, "id is not valid"],
        ["deelnemerID", validateNumber, "deelnemerID is required"],
        ["clockinDate", validateString, "clockinDate is required"],
        ["clockoutDate", validateStringOrUndefined, "clockoutDate is not valid"],
        ["workDuration", validateNumberOrZero, "workDuration is not valid"]
    );
}

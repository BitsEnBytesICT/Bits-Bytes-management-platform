import { Fun } from "../../common/functor";
import { validatorPipe } from "../../common/Validator";
import IAttendance from '../../types/attendance/IAttendance';

const validateNumber = Fun<number, boolean>(n => n > 0);
const validateNumberOrZero = Fun<number | undefined, boolean>(n => n === undefined ? true : n >= 0);
const validateNumberOrUndefined = Fun<number | undefined, boolean>(n => n === undefined ? true : n > 0);
const validateDate = Fun<string, boolean>(s => !isNaN(Date.parse(s)));
const validateDateOrUndefined = Fun<string | undefined, boolean>(s => s === undefined ? true : !isNaN(Date.parse(s)));

export default function attendanceValidator(attendance: IAttendance) {
    return validatorPipe(attendance,
        ["id", validateNumberOrUndefined, "id is not valid"],
        ["deelnemerID", validateNumber, "deelnemerID is required"],
        ["clockinDate", validateDate, "clockinDate is not a valid date"],
        ["clockoutDate", validateDateOrUndefined, "clockoutDate is not a valid date"],
        ["workDuration", validateNumberOrZero, "workDuration is not valid"]
    );
}

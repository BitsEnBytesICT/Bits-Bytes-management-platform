import { Fun } from "../../common/functor";
import { validatorPipe } from "../../common/Validator";
import ISignature from '../../types/signature/ISignature';

const validateNumber = Fun<number, boolean>(n => n > 0);
const validateNumberOrUndefined = Fun<number | undefined, boolean>(n => n === undefined ? true : n > 0);
const validateDate = Fun<string, boolean>(s => !isNaN(Date.parse(s)));
const validateString = Fun<string, boolean>(s => s.length > 0);

export default function signatureValidator(signature: ISignature) {
    return validatorPipe(signature,
        ["id", validateNumberOrUndefined, "id is not valid"],
        ["deelnemerID", validateNumber, "deelnemerID is required"],
        ["date", validateDate, "date is not a valid date"],
        ["signature", validateString, "signature is required"]
    );
}

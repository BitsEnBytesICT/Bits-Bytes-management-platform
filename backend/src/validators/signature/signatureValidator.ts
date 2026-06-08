import { Fun } from "../../common/functor";
import { validatorPipe } from "../../common/Validator";
import ISignature from '../../types/signature/ISignature';

const validateNumber = Fun<number, boolean>(n => n > 0);
const validateNumberOrUndefined = Fun<number | undefined, boolean>(n => n === undefined ? true : n > 0);
const validateString = Fun<string, boolean>(s => s.length > 0);

export default function signatureValidator(signature: ISignature) {
    return validatorPipe(signature,
        ["id", validateNumberOrUndefined, "id is not valid"],
        ["deelnemerID", validateNumber, "deelnemerID is required"],
        ["date", validateString, "date is required"],
        ["signature", validateString, "signature is required"]
    );
}

import { Fun } from "../../common/functor";
import { validatorPipe } from "../../common/Validator";
import IPermissions from "../../types/permissions/IPermissions";

const validateStringNotEmpty = Fun<string, boolean>(name => name.length > 0);
const validateAbove0OrUndefined = Fun<number | undefined, boolean>(id => id === undefined ? true : id > 0);
const validateArrayLength = Fun<any[], boolean>((arr) => arr.length > 0);

export default function permissionsValidator(permissions: IPermissions) {
    return validatorPipe(permissions, ["id", validateAbove0OrUndefined, "id is not valid"],
        ["role", validateStringNotEmpty, "role cannot be empty"],
    ["permissions", validateArrayLength, "permissions cannot be empty"]);
}
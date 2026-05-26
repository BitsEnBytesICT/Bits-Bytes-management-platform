import { Fun } from "../../common/functor";
import { validatorPipe } from "../../common/validator";
import IUser from '../../types/example/user';

const validateName = Fun<string, boolean>(name => name.length > 0);
const validateAbove0 = Fun<number, boolean>(id => id > 0);
const validateAbove0OrUndefined = Fun<number | undefined, boolean>(id => id === undefined ? true : id > 0);
const validateBirthday = Fun<Date | undefined, boolean>(bday => bday === undefined ? true : bday.getFullYear() < 1900 ? false : true);

export default function userValidator(user: IUser) {
    return validatorPipe(user, ["id", validateAbove0OrUndefined, "id is not valid"], 
        ["firstName", validateName, "name cannot be empty"],
        ["lastName", validateName, "lastname cannot be empty"],
        ["age", validateAbove0OrUndefined, "age is not valid"],
        ["birthDay", validateBirthday, "bday is not possible"]);
}
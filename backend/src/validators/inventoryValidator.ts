import { Fun } from "../common/functor";
import { ValidatorMap, validatorPipe, ValidatorTuple } from "../common/Validator";
import IInventory from "../types/inventory/IInventory";
import { validateDateOrUndefined } from "./globalValidators";

const MAX_UNSIGNED_INT = 2 ** 32 - 1;

const validateId = Fun<number, boolean>(value => Number.isInteger(value) && value > 0 && value <= MAX_UNSIGNED_INT);
const validateIdOrUndefined = Fun<number | undefined, boolean>(value => value === undefined || validateId(value));
const validateCategory = Fun<string, boolean>(value => typeof value === "string" && value.trim().length > 0 && value.length <= 255);
const validateDescription = Fun<string, boolean>(value => typeof value === "string");
const validateQuantity = Fun<number, boolean>(value => Number.isInteger(value) && value >= 0 && value <= MAX_UNSIGNED_INT);
const validateSerialNumber = Fun<string, boolean>(value => typeof value === "string" && value.length <= 255);

export const inventoryValidatorFunctors: ValidatorMap<IInventory> = {
    id: [validateIdOrUndefined, "id must be a positive integer"],
    category: [validateCategory, "category cannot be empty or above 255 chars"],
    categoryId: [validateId, "categoryId must be a positive integer"],
    description: [validateDescription, "description must be a string"],
    quantity: [validateQuantity, "quantity must be a non-negative integer"],
    serialNumber: [validateSerialNumber, "serialNumber must be a string of at most 255 chars"],
    createdAt: [validateDateOrUndefined, "createdAt must be a valid date in YYYY-MM-DD HH:mm:ss format"],
};

export function inventoryValidator(item: IInventory) {
    const mappedValidators = (Object.keys(inventoryValidatorFunctors) as Array<keyof IInventory>).map(key =>
        [key, inventoryValidatorFunctors[key][0], inventoryValidatorFunctors[key][1]] as ValidatorTuple<IInventory>);

    return validatorPipe(item, ...mappedValidators);
}

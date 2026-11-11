import { validatorFun } from "../common/functor";

const MYSQL_DATETIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

export function isMySqlDateTime(value: string): boolean {
    const match = MYSQL_DATETIME_PATTERN.exec(value);
    if (!match) return false;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const hour = Number(match[4]);
    const minute = Number(match[5]);
    const second = Number(match[6]);
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

    return date.getUTCFullYear() === year
        && date.getUTCMonth() === month - 1
        && date.getUTCDate() === day
        && date.getUTCHours() === hour
        && date.getUTCMinutes() === minute
        && date.getUTCSeconds() === second;
}

export const validatePositiveNumber = validatorFun<number>(value => value > 0);
export const validateStringEmpty = validatorFun<string | undefined>(value => !value);
export const validateNotNegativeNumber = validatorFun<number>(value => value >= 0);
export const validateNumberUndefined = validatorFun<number | undefined>(value => value === undefined);
export const validateStringNotEmpty = validatorFun<string>(value => value.length > 0);
export const validateLenBelow50 = validatorFun<string>(value => value.length < 51);
export const validateLenBelow100 = validatorFun<string>(value => value.length < 101);
export const validateDate = validatorFun<string>(isMySqlDateTime);
export const validateStringUndefined = validatorFun<string | undefined>(value => value === undefined);
export const identityValidator = validatorFun<any>((_ => true));
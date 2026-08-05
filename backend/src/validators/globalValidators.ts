import { Fun } from "../common/functor";

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

export const validatePositiveNumber = Fun<number, boolean>(value => value > 0);
export const validatePositiveNumberOrUndefined = Fun<number | undefined, boolean>(value => value === undefined || value > 0);
export const validateNotNegativeOrUndefined = Fun<number | undefined, boolean>(value => value === undefined || value >= 0);
export const validateStringNotEmpty = Fun<string, boolean>(value => value.length > 0);
export const validateStringNotEmptyAndLenBelow50Char = Fun<string, boolean>(value => value.length > 0 && value.length < 51);
export const validateDate = Fun<string, boolean>(isMySqlDateTime);
export const validateDateOrUndefined = Fun<string | undefined, boolean>(value => value === undefined || isMySqlDateTime(value));

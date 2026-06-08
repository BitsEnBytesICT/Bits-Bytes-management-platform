import { ErrorCodes } from "../types/error/ErrorCodes";
import IError from "../types/error/IError";
import { Fun } from "./functor";

export const assertNever = (x: never): never => {
  throw new Error("Unexpected value: " + x);
}

export type Result<a, b> = (
    | { kind: "error", key: keyof a, value?: b, errorMSG: IError }
    | { kind: "success", key: keyof a, value?: b });

type AllKeysValidators<a> = { [K in keyof a]: [K, Fun<a[K], boolean>, string] }[keyof a];
type HasAllKeys<a, T extends AllKeysValidators<a>[]> = [keyof a] extends [T[number][0]] ? T : never;
export const validatorPipe = <a extends object, T extends AllKeysValidators<a>[]>(data: a, ...args: T & HasAllKeys<a, T>): Result<a, a[keyof a]>[] => {
    const results: Array<Result<a, a[keyof a]>> = [];
    (args as Array<[keyof a, Fun<any, boolean>, string]>).forEach((func) => {
        const [key, validator, errorMSG] = func;
        try {
            if (validator(data[key])) results.push({ kind: "success", value: data[key], key });
            else results.push({ kind: "error", key, value: data[key], errorMSG: {date: new Date(), errorMSG: new Error(errorMSG), code: ErrorCodes.InvalidData } });
        } catch (error: any) {
            results.push({ kind: "error", key, value: data[key], errorMSG: {date: new Date(), errorMSG: new Error(errorMSG), code: ErrorCodes.InvalidData } });
        }
    });
    return results;
};
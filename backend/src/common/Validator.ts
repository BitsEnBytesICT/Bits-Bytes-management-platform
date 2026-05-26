import { Fun } from "./functor";

export class IError {
    date: Date;
    errorMSG: Error;
    constructor(date: Date, errorMSG: Error) {
        this.date = date;
        this.errorMSG = errorMSG;
    }
    toString(): string {
        return `[${this.date.toISOString()}] ${this.errorMSG.message}`;
    }
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
            else results.push({ kind: "error", key, value: data[key], errorMSG: new IError(new Date(), new Error(errorMSG) ) });
        } catch (error: any) {
            results.push({ kind: "error", key, value: data[key], errorMSG: new IError(new Date(), new Error(errorMSG) ) });
        }
    });
    return results;
};

// export const validationFactory = <a>(func: (_: a) => boolean) => {
//     return Fun<a, [a,boolean]>(func);
// }


// validationFactory((name: string) => name.length > 0)


//usage:

// interface User {
//    name: string;
//    age?: number;
// }

// const validateNameUndefined = Fun<string, [string, boolean]>(name => name === undefined ? [name, false] : [name, true]);
// const validateNameNew = Fun<[string, boolean], boolean>(name => name[1] ? true : name[0].length > 0);
// const validateName = Fun<string, boolean>(name => name.length > 0);
// const validateAge = Fun<number | undefined, boolean>(age => age == undefined ? true : age >= 0);

// const user: User = { name: "Alice", age: 30 };
// const results = validatorPipe(user, ["name", validateNameUndefined.then(validateNameNew), "Name is empty"], ["age", validateAge, "Age is negative"]);

// const user2: User = { name: "Bob" };
// const results2 = validatorPipe(user2, ["name", validateName, "Name is empty"], ["age", validateAge, "Age is negative"]);

// const user3: User = { name: "", age: 20 };
// const results3 = validatorPipe(user3, ["name", validateName, "Name is empty"], ["age", validateAge, "Age is negative"]);

// const user4: User = { name: "Rob", age: -10 };
// const results4 = validatorPipe(user4, ["name", validateName, "Name is empty"], ["age", validateAge, "Age is negative"]);

// console.log(results);
// console.log(results2);
// console.log(results3);
// console.log(results4);

// results.forEach((r) => {
//     if (r.kind === "error") throw r.errorMSG.errorMSG;
// })
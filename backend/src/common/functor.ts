export type Fun<input, output> = {
    (input: input): output,
    then: <nextOutput>(other: Fun<output, nextOutput>) => Fun<input, nextOutput>
};

export const Fun = <input, output>(actual: (_: input) => output): Fun<input, output> => {
    const f = actual as Fun<input, output>
    f.then = function <nextOutput>(this: Fun<input, output>, other: Fun<output, nextOutput>):
        Fun<input, nextOutput> {
        return Fun(input => other(this(input)))
    }
    return f
};

type ValidatorValue<input> = input extends [infer value, boolean] ? value : input;
type ValidatorResult<input> = [ValidatorValue<input>, boolean];

export type validatorFun<input> = Fun<ValidatorValue<input> | ValidatorResult<input>, ValidatorResult<input>>;

export const validatorFun = <input>(actual: (_: ValidatorValue<input>) => boolean): validatorFun<input> =>
    Fun(input => {
        const isResult = Array.isArray(input) && input.length === 2 && typeof input[1] === "boolean";
        const value = (isResult ? input[0] : input) as ValidatorValue<input>;
        const valid = isResult ? input[1] as boolean : true;
        return [value, valid && actual(value)];
    });

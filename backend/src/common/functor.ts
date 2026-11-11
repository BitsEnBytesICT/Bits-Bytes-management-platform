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
type ValidatorCheck<value> = (_: value) => boolean | [value, boolean];

export type validatorFun<input> = Fun<ValidatorValue<input> | ValidatorResult<input>, ValidatorResult<input>> & {
    and: <nextValue extends ValidatorValue<input>>(actual: ValidatorCheck<nextValue>) => validatorFun<input>;
    or: <nextValue extends ValidatorValue<input>>(actual: ValidatorCheck<nextValue>) => validatorFun<input>;
};

const checkValidity = <value>(actual: ValidatorCheck<value>, value: value): boolean => {
    const result = actual(value);
    return typeof result === "boolean" ? result : result[1];
};

const createValidatorFun = <input>(actual: (_: ValidatorValue<input> | ValidatorResult<input>) => ValidatorResult<input>): validatorFun<input> => {
    const f = Fun(actual) as validatorFun<input>;
    f.and = <nextValue extends ValidatorValue<input>>(actual: ValidatorCheck<nextValue>) => createValidatorFun<input>(input => {
        const [value, valid] = f(input);
        return [value, valid && checkValidity(actual, value as nextValue)];
    });
    f.or = <nextValue extends ValidatorValue<input>>(actual: ValidatorCheck<nextValue>) => createValidatorFun<input>(input => {
        const [value, valid] = f(input);
        return [value, valid || checkValidity(actual, value as nextValue)];
    });
    return f;
};

export const validatorFun = <input>(actual: (_: ValidatorValue<input>) => boolean): validatorFun<input> =>
    createValidatorFun<input>(input => {
        const isResult = Array.isArray(input) && input.length === 2 && typeof input[1] === "boolean";
        const value = (isResult ? input[0] : input) as ValidatorValue<input>;
        const valid = isResult ? input[1] as boolean : true;
        return [value, valid && actual(value)];
    });

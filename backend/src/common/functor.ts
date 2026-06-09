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
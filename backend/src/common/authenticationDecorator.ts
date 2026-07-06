import { createEnforcer } from "./casbin";

export default function AuthenticationDecorator(permission: string) {
    return function (
        _: undefined,
        context: ClassFieldDecoratorContext
    ) {
        return function (target: (...args: any[]) => any) {
            return async function (this: any, ...args: any[]) {
                const name = "";
                const enforcer = await createEnforcer();

                if (!name) {
                    args[1].sendStatus(403);
                    return null;
                }

                if (!await enforcer.enforce(name, "*") && !await enforcer.enforce(name, permission)) {
                    console.log(`User ${name} doesn't have the permission ${permission} to do the action ${String(context.name)}.`);
                    args[1].sendStatus(401);
                    return null;
                }
                console.log(`User ${name} has permission ${permission} to do the action ${String(context.name)}.`);
                return target.apply(this, args);
            };
        };
    };
}
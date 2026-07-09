import { createEnforcer } from "./casbin";
import jwt from "jsonwebtoken";
import { decrypt } from "./encryptorDecryptor";
import IError from "../types/error/IError";
import { ErrorCodes } from "../types/error/ErrorCodes";


export default function AuthenticationDecorator(permission: string) {
    return function (
        originalMethod: Function,
        context: ClassMethodDecoratorContext,
    ) {
        return async function (this: any, ...args: any[]) {
            let userName;
            try {
                const payload = jwt.verify(args[0].cookies["login"], String(process.env.JWT_SECRET));
                userName = !(typeof payload === "string") && "username" in payload ? payload.username : payload;
                userName = decrypt<string>(userName);
            } catch (error) {
                throw {
                    date: new Date(),
                    errorMSG: new Error("token is invalid"),
                    code: ErrorCodes.invalidCredentials
                } satisfies IError
            }
            const enforcer = await createEnforcer();

            if (!await enforcer.enforce(userName, permission)) {
                console.log(`User ${userName} doesn't have the permission ${permission} to do the action ${String(context.name)}.`);
                args[1].sendStatus(423);
                return;
            }
            console.log(`User ${userName} has permission ${permission} to do the action ${String(context.name)}.`);

            return originalMethod.call(this, ...args);
        };
    };
}
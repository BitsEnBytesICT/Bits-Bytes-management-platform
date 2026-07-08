import { decrypt } from "../../common/encryptorDecryptor";
import serviceBase from "../../common/serviceBase";
import { KeyValuePair } from "../../common/Validator";
import IAccount from "../../types/accounts/IAccount";
import { ErrorCodes } from "../../types/error/ErrorCodes";
import IError from "../../types/error/IError";
import AccountDAO from "./accounts.dao";
import jwt from "jsonwebtoken";

export default class AccountService implements serviceBase<IAccount> {
    dao: AccountDAO;

    constructor() {
        this.dao = new AccountDAO();
    }

    async findOne(...where: KeyValuePair<IAccount>[]): Promise<IAccount | undefined> {
        return await this.dao.findOne(...where);
    }

    create(account: IAccount): void {
        throw new Error("Method not implemented.");
    }
    update(...args: any[]): void {
        throw new Error("Method not implemented.");
    }
    delete(...args: any[]): void {
        throw new Error("Method not implemented.");
    }
    async list(): Promise<IAccount[]> {
        return await this.dao.list();
    }

    async current(token: string): Promise<IAccount> {
        let payload;
        try {
            payload = jwt.verify(token, String(process.env.JWT_SECRET));
        } catch (error) {
            throw {
                date: new Date(),
                errorMSG: new Error("token is invalid"),
                code: ErrorCodes.invalidCredentials
            } satisfies IError
        }

        let userName: string = !(typeof payload === "string") && "username" in payload ? payload.username : token;
        userName = decrypt<string>(userName);

        const account = await this.findOne(["username", userName]);
        if (account) return account
        else {
            throw {
                date: new Date(),
                errorMSG: new Error("token is invalid"),
                code: ErrorCodes.invalidCredentials
            } satisfies IError
        }
    }
}
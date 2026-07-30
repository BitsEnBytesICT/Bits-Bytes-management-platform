import { decrypt, encrypt } from "../../common/encryptorDecryptor";
import { ErrorCodes } from "../../types/error/ErrorCodes";
import IError from "../../types/error/IError";
import AccountService from "../accounts/accounts.service";
import jwt from "jsonwebtoken";
import AuthDAO from "./auth.dao";

export const FIFTEEN_MINUES_IN_SECONDS = 900;

export default class AuthService {
    private accountService: AccountService = new AccountService();

    dao: AuthDAO;
    
    constructor() {
        this.dao = new AuthDAO();
    }

    login = async (username: string, password: string) => {
        if (!username || !password) throw {
            date: new Date(),
            errorMSG: new Error("gebruikersnaam of wachtwoord mist"),
            code: ErrorCodes.InvalidData
        } satisfies IError

        const account = await this.accountService.findOne(["username", username]);

        if (!account || decrypt<string>(account.password) !== password)  throw {
            date: new Date(),
            errorMSG: new Error("login gegevens zijn niet juist."),
            code: ErrorCodes.invalidCredentials
        } satisfies IError
        
        return jwt.sign(
            { username: encrypt(username) },
            String(process.env.JWT_SECRET),
            { expiresIn: FIFTEEN_MINUES_IN_SECONDS }
        )
    }

    verify = async (token: string) => {
        try {
            const payload = jwt.verify(token, String(process.env.JWT_SECRET));
            let userName: string = !(typeof payload === "string") && "username" in payload ? payload.username : payload;
            userName = decrypt<string>(userName);

            const account = await this.accountService.findOne(["username", userName]);

            if (!account) throw {
                date: new Date(),
                errorMSG: new Error("token is invalid"),
                code: ErrorCodes.invalidCredentials
            } satisfies IError
        } catch (error) {
            throw {
                date: new Date(),
                errorMSG: new Error("token is invalid"),
                code: ErrorCodes.invalidCredentials
            } satisfies IError
        }
    }

    refresh = async (token: string) => {
        try {
            const payload = jwt.verify(token, String(process.env.JWT_SECRET), {ignoreExpiration: true});
            let userName: string = !(typeof payload === "string") && "username" in payload ? payload.username : payload;
            userName = decrypt<string>(userName);

            const account = await this.accountService.findOne(["username", userName]);

            if (!account) throw {
                date: new Date(),
                errorMSG: new Error("token is invalid"),
                code: ErrorCodes.invalidCredentials
            } satisfies IError

            return jwt.sign(
                { username: encrypt(account.username) },
                String(process.env.JWT_SECRET),
                { expiresIn: FIFTEEN_MINUES_IN_SECONDS }
            )
        } catch (error) {
            throw {
                date: new Date(),
                errorMSG: new Error("token is invalid"),
                code: ErrorCodes.invalidCredentials
            } satisfies IError
        }
    }

    listApiKeys = async () => {
        return await this.dao.listApiKeys();
    }
}
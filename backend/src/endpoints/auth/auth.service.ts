import { ErrorCodes } from "../../types/error/ErrorCodes";
import IError from "../../types/error/IError";
import AccountService from "../accounts/accounts.service";
import jwt from "jsonwebtoken";


export default class AuthService {
    private accountService: AccountService = new AccountService();

    login = async (username: string, password: string) => {
        const account = await this.accountService.findOne(["username", username], ["password", password]);

        if (!account)  throw {
            date: new Date(),
            errorMSG: new Error("login gegevens zijn niet juist."),
            code: ErrorCodes.invalidCredentials
        } satisfies IError

        if (!process.env.JWT_SECRET) throw {
            date: new Date(),
            errorMSG: new Error("Er is een onverwachte fout geweest. JWT_SECRET ontbreekt"),
            code: ErrorCodes.Unknown
        } satisfies IError
        
        return jwt.sign(
            { usename: username },
            process.env.JWT_SECRET,
            { expiresIn: 172.800 }
        )
    }
}
import { decrypt } from "../../common/encryptorDecryptor";
import serviceBase from "../../common/serviceBase";
import { KeyValuePair } from "../../common/Validator";
import IAccount from "../../types/accounts/IAccount";
import { ErrorCodes } from "../../types/error/ErrorCodes";
import IError from "../../types/error/IError";
import { AccountValidator } from "../../validators/accountValidator";
import ParticipantDao from "../participants/participants.dao";
import ParticipantService from "../participants/participants.service";
import AccountDAO from "./accounts.dao";
import jwt from "jsonwebtoken";

export default class AccountService implements serviceBase<IAccount> {
    dao: AccountDAO;
    participantDAO: ParticipantDao;

    constructor() {
        this.dao = new AccountDAO();
        this.participantDAO = new ParticipantDao();
    }

    async findOne(...where: KeyValuePair<IAccount>[]): Promise<IAccount | undefined> {
        const account = await this.dao.findOne(...where);
        if (account?.password) account.password = decrypt(account.password);
        return account;
    }

    async create(account: IAccount) {
        if (!account) throw {
            date: new Date(),
            errorMSG: new Error("account is required"),
            code: ErrorCodes.InvalidData
        } satisfies IError

        const errors = AccountValidator(account).filter((result) => result.kind === "error").map((r) => r.errorMSG);
        if (errors && errors.length > 0) throw errors;

        await this.dao.create(account);
    }

    update(...args: any[]): void {
        throw new Error("Method not implemented.");
        //when updating an account. Check if this account is connected to a participant. If so the first and last name of that perticipant should also change
    }

    async delete(id: number) {
        const participant = await this.participantDAO.findOne(["account", id]);
        if (participant?.id) await this.participantDAO.delete(["id", participant.id]);
        await this.dao.delete(["id", id]);
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
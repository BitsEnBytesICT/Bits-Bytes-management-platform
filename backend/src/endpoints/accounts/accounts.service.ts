import { decrypt, encrypt } from "../../common/encryptorDecryptor";
import serviceBase from "../../common/serviceBase";
import { KeyValuePair, ValidatorTuple } from "../../common/Validator";
import IAccount from "../../types/accounts/IAccount";
import { ErrorCodes } from "../../types/error/ErrorCodes";
import IError from "../../types/error/IError";
import { AccountValidator, accountValidatorFunctors, partialAccountValidator } from "../../validators/accountValidator";
import ParticipantDao from "../participants/participants.dao";
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

    async update(where: KeyValuePair<IAccount>, ...args: KeyValuePair<IAccount>[]) {
        const validatorFunctors = args.map((item) => 
                    [item[0], accountValidatorFunctors[item[0]][0], accountValidatorFunctors[item[0]][1]] as ValidatorTuple<IAccount>);
        
        const validationResult = partialAccountValidator(Object.fromEntries(args), validatorFunctors);
        const errors = validationResult.filter((r) => r.kind === "error").map((r) => r.errorMSG);
        if (errors.length > 0) throw errors;

        const currentAccount = await this.dao.findOne(where);
        if (!currentAccount?.id) throw {
            date: new Date(),
            errorMSG: new Error("cannot find participant"),
            code: ErrorCodes.InvalidData
        } satisfies IError

        const participant = await this.participantDAO.findOne(["account", currentAccount.id]);
        const firstname = args.find((value) => value[0] === "firstname");
        const lastname = args.find((value) => value[0] === "lastname");
        if ((firstname && firstname[1] !== participant?.firstname) || (lastname && lastname[1] !== participant?.lastname)) {
            await this.participantDAO.update(["id", participant?.id], ["firstname", currentAccount.firstname], ["lastname", currentAccount.lastname]);
        }

        const item = args[args.indexOf(args.find((value) => value[0] === "password") as KeyValuePair<IAccount>)];
        if (item) item[1] = encrypt(item[1]);

        await this.dao.update(where, ...args);
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
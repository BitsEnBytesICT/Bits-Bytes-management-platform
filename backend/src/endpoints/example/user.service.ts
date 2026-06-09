import serviceBase from "../../common/serviceBase";
import IUser from "../../types/example/user";
import userValidator from "../../validators/example/userValidator";
import UserDao from "./user.dao";

export default class UserService implements serviceBase<IUser> {
    dao: UserDao;

    constructor() {
       this.dao = new UserDao();
    }

    //handle data management and receive / send data to dao
    create(user: IUser): void {
        const validationResult = userValidator(user);
        if (validationResult.find((r) => r.kind === "error") === undefined) this.dao.create(user);
        else 
        {
            const error = validationResult.filter((r) => r.kind === "error").map((error) => error.errorMSG);
            throw error;
        }
    }
    
    update(): void {
        throw new Error("Method not implemented.");
    }
    delete(): void {
        throw new Error("Method not implemented.");
    }
    list(): IUser[] {
        throw new Error("Method not implemented.");
    }
}
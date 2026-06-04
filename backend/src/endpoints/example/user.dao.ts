import daoBase from "../../common/daoBase";
import IUser from "../../types/example/user";


export default class UserDao implements daoBase<IUser> {
    //function: communicate to the database
    create(user: IUser): void {
        //create user in db
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
import { ErrorCodes } from "./ErrorCodes";

export default interface IError {
    date: Date;
    errorMSG: Error;
    code: ErrorCodes
}
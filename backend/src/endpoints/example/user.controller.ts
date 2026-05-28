import controllerBase from "../../common/controllerBase";
import IUser from "../../types/example/user";
import UserService from "./user.service";
import express, { Request, Response } from "express";

export default class UserController implements controllerBase<IUser> {
    service: UserService;

    constructor() {
        this.service = new UserService();
    }

    //function: handle params in body / query and pass to service
    create = (req: Request, res: Response): void => {
        this.service.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            birthDay: req.body.bday ? new Date(req.body.bday) : undefined
        });

        res.sendStatus(200);
    }
    update = (req: Request, res: Response): void => {
        throw new Error("Method not implemented.");
    }
    delete = (req: Request, res: Response): void => {
        throw new Error("Method not implemented.");
    }
    list = (req: Request, res: Response): void => {
        throw new Error("Method not implemented.");
    }
}
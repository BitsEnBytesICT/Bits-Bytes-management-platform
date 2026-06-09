import express, { Request, Response } from "express";
import serviceBase from "./serviceBase";

export default interface controllerBase<a> {
    service: serviceBase<a>;
    create(req: Request, res: Response): void;
    update(req: Request, res: Response): void;
    delete(req: Request, res: Response): void;
    list(req: Request, res: Response): void;
}
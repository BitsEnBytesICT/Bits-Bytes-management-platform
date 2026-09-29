import AuthenticationDecorator from '../../common/authenticationDecorator';
import { PermissionsList } from '../../types/permissions/permissionsList';
import AccountService from './accounts.service';
import { Request, Response } from 'express';

export default class AccountController {
    private service: AccountService;

    constructor() {
        this.service = new AccountService();
    }

    @AuthenticationDecorator(PermissionsList.accountCurrent)
    async current (req: Request, res: Response) {
        const account = await this.service.current(req.cookies["login"]);
        res.status(200).json(account);
    }

    @AuthenticationDecorator(PermissionsList.accountCreate)
    async create (req: Request, res: Response) {
        await this.service.create(req.body.account);
        res.sendStatus(200);
    }

    @AuthenticationDecorator(PermissionsList.accountList)
    async findOne (req: Request, res: Response) {
        const account = await this.service.findOne(...req.body.where);
        res.status(200).json(account);
    }

    @AuthenticationDecorator(PermissionsList.accountDelete)
    async delete (req: Request, res: Response) {
        await this.service.delete(req.body.id);
        res.sendStatus(200);
    }

    @AuthenticationDecorator(PermissionsList.accountUpdate)
    async update (req: Request, res: Response) {
        await this.service.update(req.body.where, ...req.body.values);
        res.sendStatus(200);
    }
}

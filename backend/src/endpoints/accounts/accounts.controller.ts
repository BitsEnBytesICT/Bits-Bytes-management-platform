import AuthenticationDecorator from '../../common/authenticationDecorator';
import AccountService from './accounts.service';
import { Request, Response } from 'express';

export default class AccountController {
    private service: AccountService;

    constructor() {
        this.service = new AccountService();
    }

    @AuthenticationDecorator("account.current")
    async current (req: Request, res: Response) {
        const account = await this.service.current(req.cookies["login"]);
        res.status(200).json(account);
    }

    @AuthenticationDecorator("account.create")
    async create (req: Request, res: Response) {
        await this.service.create(req.body.account);
        res.sendStatus(200);
    }

    @AuthenticationDecorator("account.list")
    async findOne (req: Request, res: Response) {
        const account = await this.service.findOne(...req.body.where);
        res.status(200).json(account);
    }

    @AuthenticationDecorator("account.delete")
    async delete (req: Request, res: Response) {
        await this.service.delete(req.body.id);
        res.sendStatus(200);
    }
}
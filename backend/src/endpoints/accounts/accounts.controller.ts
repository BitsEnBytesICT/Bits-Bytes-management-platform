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
}
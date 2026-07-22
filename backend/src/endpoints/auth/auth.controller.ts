import { Request, Response } from 'express';
import AuthService, { FIFTEEN_MINUES_IN_SECONDS } from './auth.service';

export default class AuthController {
    private service: AuthService;
    
    constructor() {
        this.service = new AuthService();
    }

    login = async (req: Request, res: Response) => {
        const token = await this.service.login(req.body.username, req.body.password);
        res.cookie('login', token, { path: '/', httpOnly: true, sameSite: "strict", maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.sendStatus(200);
    }

    verify = async (req: Request, res: Response) => {
        await this.service.verify(req.cookies["login"]);
        res.sendStatus(200);
    }

    refresh = async (req: Request, res: Response) => {
        const token = await this.service.refresh(req.cookies["login"]);
        res.cookie('login', token, { path: '/', httpOnly: true, sameSite: "strict", maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.sendStatus(200);
    }

    logout = async (req: Request, res: Response) => {
        res.clearCookie('login', { path: '/', httpOnly: true, sameSite: "strict", maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.sendStatus(200);
    }
}
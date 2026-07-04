import { Request, Response } from 'express';
import AuthService from './auth.service';

export default class AuthController {
    private service: AuthService;
    
    constructor() {
        this.service = new AuthService();
    }

    login = (req: Request, res: Response) => {
        const token = this.service.login(req.body.username, req.body.password);
        res.cookie('login', token, { path: '/', httpOnly: true, maxAge: 3600000, sameSite: "strict" });
        res.sendStatus(200);
    }

    verify = () => {

    }
}
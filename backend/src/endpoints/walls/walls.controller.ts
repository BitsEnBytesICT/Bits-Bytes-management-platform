import type { Request, Response } from 'express';
import AuthenticationDecorator from '../../common/authenticationDecorator';
import WallService from './walls.service';

export default class WallController {
    private service: WallService;

    constructor() {
        this.service = new WallService();
    }

    @AuthenticationDecorator('wall.list')
    async list(req: Request, res: Response) {
        const walls = await this.service.list(...(req.body?.where ?? []));
        res.json(walls);
    }
}

import type { Request, Response } from 'express';
import AuthenticationDecorator from '../../common/authenticationDecorator';
import RoomService from './rooms.service';

export default class RoomController {
    private service: RoomService;

    constructor() {
        this.service = new RoomService();
    }

    @AuthenticationDecorator('room.list')
    async list(req: Request, res: Response) {
        const rooms = await this.service.list(...(req.body?.where ?? []));
        res.json(rooms);
    }
}

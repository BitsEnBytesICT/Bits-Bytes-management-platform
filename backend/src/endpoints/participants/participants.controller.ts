import { Request, Response } from 'express';
import ParticipantService from './participants.service';

export default class ParticipantController {
    private service: ParticipantService;

    constructor() {
        this.service = new ParticipantService();
    }

    count = async(req: Request, res: Response) => {
        const count = await this.service.count();
        res.json({ count });
    }

    countPresent = async(req: Request, res: Response) => {
        const count = await this.service.countPresent();
        res.json({ count });
    }

    list = async(req: Request, res: Response) => {
        const participants = await this.service.list();
        res.json(participants);
    }
}

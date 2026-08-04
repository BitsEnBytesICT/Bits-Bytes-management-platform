import { Request, Response } from 'express';
import ParticipantService from './participants.service';
import AuthenticationDecorator from '../../common/authenticationDecorator';

export default class ParticipantController {
    private service: ParticipantService;

    constructor() {
        this.service = new ParticipantService();
    }

    @AuthenticationDecorator("participant.list")
    async count (req: Request, res: Response) {
        const count = await this.service.count();
        res.json({ count });
    }

    @AuthenticationDecorator("participant.list")
    async countPresent (req: Request, res: Response) {
        const count = await this.service.countPresent();
        res.json({ count });
    }

    @AuthenticationDecorator("participant.list")
    async list (req: Request, res: Response) {
        const participants = await this.service.list();
        res.json(participants);
    }

    @AuthenticationDecorator("participant.create")
    async create (req: Request, res: Response) {
        await this.service.create(req.body.participant, req.body.account);
        res.sendStatus(200);
    }

    @AuthenticationDecorator("participant.update")
    async update (req: Request, res: Response) {
        await this.service.update(req.body.where, ...req.body.values);
        res.sendStatus(200);
    }

    @AuthenticationDecorator("participant.delete")
    async delete (req: Request, res: Response) {
        await this.service.delete(req.body.id);
        res.sendStatus(200);
    }
}

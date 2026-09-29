import { Request, Response } from 'express';
import ParticipantService from './participants.service';
import AuthenticationDecorator from '../../common/authenticationDecorator';
import { PermissionsList } from '../../types/permissions/permissionsList';

export default class ParticipantController {
    private service: ParticipantService;

    constructor() {
        this.service = new ParticipantService();
    }

    @AuthenticationDecorator(PermissionsList.participantList)
    async count (req: Request, res: Response) {
        const count = await this.service.count();
        res.json({ count });
    }

    @AuthenticationDecorator(PermissionsList.participantList)
    async countPresent (req: Request, res: Response) {
        const count = await this.service.countPresent();
        res.json({ count });
    }

    @AuthenticationDecorator(PermissionsList.participantList)
    async countClockedin (req: Request, res: Response) {
        const count = await this.service.countClockedin();
        res.json({ count });
    }

    @AuthenticationDecorator(PermissionsList.participantList)
    async findOne(req: Request, res: Response) {
        const participant = await this.service.findOne(...(req.body?.where ?? []));
        res.json(participant);
    }

    @AuthenticationDecorator(PermissionsList.participantList)
    async list (req: Request, res: Response) {
        const participants = await this.service.list(...(req.body?.where ?? []));
        res.json(participants);
    }

    @AuthenticationDecorator(PermissionsList.participantCreate)
    async create (req: Request, res: Response) {
        await this.service.create(req.body.participant, req.body.account);
        res.sendStatus(200);
    }

    @AuthenticationDecorator(PermissionsList.participantUpdate)
    async update (req: Request, res: Response) {
        await this.service.update(req.body.where, ...req.body.values);
        res.sendStatus(200);
    }

    @AuthenticationDecorator(PermissionsList.participantDelete)
    async delete (req: Request, res: Response) {
        await this.service.delete(req.body.id);
        res.sendStatus(200);
    }
}

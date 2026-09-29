import type { Request, Response } from 'express';
import AuthenticationDecorator from '../../common/authenticationDecorator';
import { PermissionsList } from '../../types/permissions/permissionsList';
import WorkplaceService from './workplaces.service';

export default class WorkplaceController {
    private service: WorkplaceService;

    constructor() {
        this.service = new WorkplaceService();
    }

    @AuthenticationDecorator(PermissionsList.workplaceList)
    async list(req: Request, res: Response) {
        const workplaces = await this.service.list(...(req.body?.where ?? []));
        res.json(workplaces);
    }
}

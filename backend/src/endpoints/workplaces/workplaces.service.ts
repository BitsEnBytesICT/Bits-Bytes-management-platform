import type { KeyValuePair } from '../../common/Validator';
import type { IWorkplace } from '../../types/floorPlans/IWorkplace';
import WorkplaceDao from './workplaces.dao';

export default class WorkplaceService {
    private dao: WorkplaceDao;

    constructor() {
        this.dao = new WorkplaceDao();
    }

    async list(...where: KeyValuePair<IWorkplace>[]): Promise<IWorkplace[]> {
        return await this.dao.list(...where);
    }
}

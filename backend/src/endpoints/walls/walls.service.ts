import type { KeyValuePair } from '../../common/Validator';
import type { IWall } from '../../types/floorPlans/IWall';
import WallDao from './walls.dao';

export default class WallService {
    private dao: WallDao;

    constructor() {
        this.dao = new WallDao();
    }

    async list(...where: KeyValuePair<IWall>[]): Promise<IWall[]> {
        return await this.dao.list(...where);
    }
}

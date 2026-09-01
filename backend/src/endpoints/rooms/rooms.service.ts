import type { KeyValuePair } from '../../common/Validator';
import type { IRoom } from '../../types/floorPlans/IRoom';
import RoomDao from './rooms.dao';

export default class RoomService {
    private dao: RoomDao;

    constructor() {
        this.dao = new RoomDao();
    }

    async list(...where: KeyValuePair<IRoom>[]): Promise<IRoom[]> {
        return await this.dao.list(...where);
    }
}

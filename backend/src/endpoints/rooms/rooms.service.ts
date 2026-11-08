import serviceBase from '../../common/serviceBase';
import type { KeyValuePair } from '../../common/Validator';
import type { IRoom } from '../../types/floorPlans/IRoom';
import RoomDao from './rooms.dao';

export default class RoomService implements serviceBase<IRoom> {
    dao: RoomDao;

    constructor() {
        this.dao = new RoomDao();
    }

    create(...args: any[]): void {
        throw new Error('Method not implemented.');
    }

    update(where: KeyValuePair<IRoom>, ...args: KeyValuePair<IRoom>[]): void {
        throw new Error('Method not implemented.');
    }
    
    delete(...args: any[]): void {
        throw new Error('Method not implemented.');
    }

    async findOne(...where: KeyValuePair<IRoom>[]): Promise<IRoom | undefined> {
        return await this.dao.findOne(...where);
    }

    async list(...where: KeyValuePair<IRoom>[]): Promise<IRoom[]> {
        return await this.dao.list(...where);
    }
}

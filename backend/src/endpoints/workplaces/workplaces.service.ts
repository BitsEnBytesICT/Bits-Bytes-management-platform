import serviceBase from '../../common/serviceBase';
import type { KeyValuePair, ValidatorTuple } from '../../common/Validator';
import { ErrorCodes } from '../../types/error/ErrorCodes';
import IError from '../../types/error/IError';
import type { IWorkplace } from '../../types/floorPlans/IWorkplace';
import { partialWorkplaceValidator, workplaceValidator, workplaceValidatorFunctors } from '../../validators/workplaceValidator';
import RoomService from '../rooms/rooms.service';
import WorkplaceDao from './workplaces.dao';

export default class WorkplaceService implements serviceBase<IWorkplace> {
    dao: WorkplaceDao;
    roomService: RoomService;

    constructor() {
        this.dao = new WorkplaceDao();
        this.roomService = new RoomService();
    }

    async update(where: KeyValuePair<IWorkplace>, ...values: KeyValuePair<IWorkplace>[]) {
        if (!where || !values) throw {
            date: new Date(),
            errorMSG: new Error("where clause and values are required"),
            code: ErrorCodes.InvalidData
        } satisfies IError

        const validatorFunctors = values.map((item) => 
            [item[0], workplaceValidatorFunctors[item[0]][0], workplaceValidatorFunctors[item[0]][1]] as ValidatorTuple<IWorkplace>);

        const validationResult = partialWorkplaceValidator(Object.fromEntries(values), validatorFunctors);
        const errors = validationResult.filter((r) => r.kind === "error").map((r) => r.errorMSG);
        if (errors.length > 0) throw errors;

        await this.dao.update(where, ...values);
    }

    delete(...args: any[]): void {
        throw new Error('Method not implemented.');
    }

    findOne(...args: KeyValuePair<IWorkplace>[]): Promise<IWorkplace | undefined> {
        throw new Error('Method not implemented.');
    }

    async list(...where: KeyValuePair<IWorkplace>[]): Promise<IWorkplace[]> {
        return await this.dao.list(...where);
    }

    async create(workplace: IWorkplace): Promise<void> {
        if (!workplace) throw {
            date: new Date(),
            errorMSG: new Error("workplace is required"),
            code: ErrorCodes.InvalidData,
        } satisfies IError;

        const errors = workplaceValidator(workplace)
            .filter(result => result.kind === "error")
            .map(result => result.errorMSG);
        if (errors.length > 0) throw errors;

        const room = await this.roomService.findOne(["id", workplace.RoomID]);
        if (!room) throw {
            date: new Date(),
            errorMSG: new Error("room not found"),
            code: ErrorCodes.InvalidData,
        } satisfies IError;

        await this.dao.create(workplace);
    }
}

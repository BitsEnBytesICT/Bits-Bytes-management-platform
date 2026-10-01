import type {IWall} from "../../../types/floorPlans/IWall";
import type {IWorkplace} from "../../../types/floorPlans/IWorkplace";
import type ISchedule from "../../../types/schedules/ISchedule";
import type {KeyValuePair} from "../../../types/validation/keyvaluePair";
import {toDateString} from "../../helperFunctions";
import http from "../../http";

export default class FloorplansService {
    getWorkplaces = async (roomID: number): Promise<IWorkplace[]> => {
        return await (
            await http("/api/workplaces", "POST", {
                where: [["RoomID", roomID]] satisfies KeyValuePair<IWorkplace>[],
            })
        ).json();
    };

    createScedule = async (schedule: ISchedule): Promise<string[]> => {
        const response = await http("/api/schedules/create", "POST", {
            schedule: {
                ...schedule,
                startDate: toDateString(schedule.startDate),
                endDate: schedule.endDate ? toDateString(schedule.endDate) : undefined,
            },
        });
        if (response.status === 200) return [];
        else return await response.json();
    };

    updateScedule = async (where: KeyValuePair<ISchedule>, ...values: KeyValuePair<ISchedule>[]) => {
        const response = await http("/api/schedules/update", "POST", {
            where: where,
            values: values.map(([key, value]) => {
                if ((key === "startDate" || key === "endDate") && value) {
                    return [key, toDateString(value)];
                }
                return [key, value];
            }),
        });
        if (response.status === 200) return [];
        else return await response.json();
    };

    getWalls = async (roomID: number): Promise<IWall[]> => {
        return await (
            await http("/api/walls", "POST", {where: [["RoomID", roomID]] satisfies KeyValuePair<IWall>[]})
        ).json();
    };
}

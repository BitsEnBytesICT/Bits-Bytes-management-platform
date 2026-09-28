import type {IWall} from "../../../types/floorPlans/IWall";
import type {IWorkplace} from "../../../types/floorPlans/IWorkplace";
import type {KeyValuePair} from "../../../types/validation/keyvaluePair";
import http from "../../http";

export async function getWorkplaces(roomID: number): Promise<IWorkplace[]> {
    return await (
        await http("/api/workplaces", "POST", {
            where: [["RoomID", roomID]] satisfies KeyValuePair<IWorkplace>[],
        })
    ).json();
}

export async function getWalls(roomID: number): Promise<IWall[]> {
    return await (
        await http("/api/walls", "POST", {where: [["RoomID", roomID]] satisfies KeyValuePair<IWall>[]})
    ).json();
}

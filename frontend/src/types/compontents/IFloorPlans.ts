import type {ComponentType} from "react";
import type {IRoom} from "../floorPlans/IRoom";
import type IParticipant from "./IParticipant";
import type {FloorplansPopUp} from "../floorPlans/floorplantsPopUp";

export default interface IFloorPlans {
    rooms: IRoom[];
    participants: IParticipant[];
    popUpContent: ComponentType<FloorplansPopUp>;
    dayButtons?: boolean;
    height?: string;
}

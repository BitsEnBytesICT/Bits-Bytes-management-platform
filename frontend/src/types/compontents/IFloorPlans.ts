import type {ComponentType} from "react";
import type {IRoom} from "../floorPlans/IRoom";
import type FloorplansPopUp from "../floorPlans/floorplantsPopUp";
import type {IParticipantWithSchedules} from "./IParticipant";
import type ISchedule from "../schedules/ISchedule";

export default interface IFloorPlans<T> {
    rooms: IRoom[];
    participants: IParticipantWithSchedules[];
    PopUpContent?: ComponentType<FloorplansPopUp<NoInfer<T>>>;
    dayButtons?: boolean;
    popupPropsExtra?: T;
    height?: string;
    currentEditedScedule?: ISchedule;
}

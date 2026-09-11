import type {IRoom} from "../floorPlans/IRoom";
import type IParticipant from "./IParticipant";

export default interface IFloorPlans {
    rooms: IRoom[];
    participants: IParticipant[];
}

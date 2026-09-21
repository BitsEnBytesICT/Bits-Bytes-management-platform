import type {RefObject} from "react";
import type {WorkplaceWithOccupancy} from "./IWorkplace";
import type IParticipant from "../compontents/IParticipant";
import type {IRoom} from "./IRoom";
import type {IWall} from "./IWall";

export interface FloorplansPopUpDefault {
    canvas: RefObject<HTMLCanvasElement | null>;
    currentWorkplace: WorkplaceWithOccupancy;
    participants: IParticipant[];
    setCurrentWorkplace: (workplace: WorkplaceWithOccupancy) => void;
    currentScale: RefObject<number | undefined>;
    setWorkplaces: React.Dispatch<React.SetStateAction<WorkplaceWithOccupancy[]>>;
    room: IRoom;
    workplaces: WorkplaceWithOccupancy[];
    walls: IWall[];
}

export interface FloorplansPopUpAddParticipant {
    currentWorkplace: WorkplaceWithOccupancy;
}

export type FloorplansPopUp = FloorplansPopUpDefault | FloorplansPopUpAddParticipant;

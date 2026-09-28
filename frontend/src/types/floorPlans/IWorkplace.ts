export interface IWorkplace {
    id?: number;
    xpos: number;
    ypos: number;
    RoomID: number;
    name: string;
    extraInfo?: string;
    rotation?: 0 | 90;
}

export interface IOccupancy {
    timeslots: {Ochtend: string; Middag: string}[];
}

export type WorkplaceWithOccupancy = IWorkplace & IOccupancy;

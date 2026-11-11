import type ISchedule from "../schedules/ISchedule";

export interface IParticipant {
    id?: number;
    firstname: string;
    prefix?: string;
    lastname: string;
    organisation: string;
    account: number;
    rfid: string;
    createdAt: string;
    active: number;
    clockedin?: number;
    financing?: string;
    bday?: string;
}

export interface IParticipantWithSchedules extends IParticipant {
    schedules: ISchedule[];
}

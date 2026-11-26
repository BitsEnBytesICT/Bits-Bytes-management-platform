import ISchedule from "../schedules/ISchedule";

export default interface IParticipant {
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
    shortComments?: string;
}

export interface IParticipantWithSchedules extends IParticipant {
    schedules: ISchedule[];
}

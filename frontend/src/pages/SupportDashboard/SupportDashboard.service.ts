import {fromDateString} from "../../common/helperFunctions";
import http from "../../common/http";
import type {IParticipant} from "../../types/compontents/IParticipant";

import type {IRoom} from "../../types/floorPlans/IRoom";
import type ISchedule from "../../types/schedules/ISchedule";

export default class SupportDashboardService {
    getTotalParticipants = async () => {
        let total = 0;

        await http("/api/participants/count", "GET").then(async res => {
            if (res.status === 200) total = (await res.json()).count;
        });

        return total;
    };

    getPresentParticipants = async () => {
        let present: IParticipant[] = [];

        await http("/api/participants/count/present", "GET").then(async res => {
            if (res.status === 200) present = (await res.json()).count;
        });

        return present;
    };

    getClockedinParticipants = async () => {
        let clockedin = 0;

        await http("/api/participants/count/clockedin", "GET").then(async res => {
            if (res.status === 200) clockedin = (await res.json()).count;
        });

        return clockedin;
    };

    getParticipants = async (): Promise<IParticipant[]> => {
        let participants: IParticipant[] = [];

        await http("/api/participants", "POST").then(async res => {
            if (res.status === 200) participants = await res.json();
        });

        return participants;
    };

    getScedules = async (): Promise<ISchedule[]> => {
        const schedules = await (await http("/api/schedules", "POST")).json();

        return schedules.map(schedule => ({
            ...schedule,
            startDate: fromDateString(schedule.startDate),
            endDate: schedule.endDate ? fromDateString(schedule.endDate) : undefined,
        }));
    };

    getRooms = async (): Promise<IRoom[]> => {
        let rooms: IRoom[] = [];

        await http("/api/rooms", "POST").then(async res => {
            if (res.status === 200) rooms = await res.json();
        });

        return rooms;
    };
}

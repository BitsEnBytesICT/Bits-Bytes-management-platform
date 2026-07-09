import http from "../../common/http";

import type IParticipant from "../../types/compontents/IParticipant";

export default class SupportDashboardService {
    isVerified = async () => {
        return (await http("/api/verify", "POST")).status;
    };

    getTotalParticipants = async () => {
        let total = 0;

        await http("/api/participants/count", "GET").then(async res => {
            if (res.status === 200) total = (await res.json()).count;
        });

        return total;
    };

    getPresentParticipants = async () => {
        let present = 0;

        await http("/api/participants/count/present", "GET").then(async res => {
            if (res.status === 200) present = (await res.json()).count;
        });

        return present;
    };

    getParticipants = async (): Promise<IParticipant[]> => {
        let participants: IParticipant[] = [];

        await http("/api/participants", "GET").then(async res => {
            if (res.status === 200) participants = await res.json();
        });

        return participants;
    };
}

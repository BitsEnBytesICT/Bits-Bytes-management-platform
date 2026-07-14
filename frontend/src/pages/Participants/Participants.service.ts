import http from "../../common/http";

import type IParticipant from "../../types/compontents/IParticipant";

export default class ParticipantsService {
    getParticipants = async (): Promise<IParticipant[]> => {
        let participants: IParticipant[] = [];

        await http("/api/participants", "GET").then(async res => {
            if (res.status === 200) participants = await res.json();
        });

        return participants;
    };
}

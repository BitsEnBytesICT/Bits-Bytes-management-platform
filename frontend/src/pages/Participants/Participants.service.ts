import http from "../../common/http";
import type IAccount from "../../types/accounts/IAccount";

import type IParticipant from "../../types/compontents/IParticipant";
import type {KeyValuePair} from "../../types/validation/keyvaluePair";

export default class ParticipantsService {
    getParticipants = async (): Promise<IParticipant[]> => {
        let participants: IParticipant[] = [];

        await http("/api/participants", "POST").then(async res => {
            if (res.status === 200) participants = await res.json();
        });

        return participants;
    };

    createParticipant = async (participant: IParticipant, account: IAccount): Promise<string[]> => {
        const response = await http("/api/participants/create", "POST", {
            participant: participant,
            account: account,
        });
        if (response.status === 200) return;
        else return await response.json();
    };

    updateParticipant = async (where: KeyValuePair<IParticipant>, ...values: KeyValuePair<IParticipant>[]) => {
        const response = await http("/api/participants/update", "POST", {
            where: where,
            values: values,
        });
        if (response.status === 200) return;
        else return await response.json();
    };

    updateAccount = async (where: KeyValuePair<IAccount>, ...values: KeyValuePair<IAccount>[]) => {
        const response = await http("/api/account/update", "POST", {
            where: where,
            values: values,
        });
        if (response.status === 200) return;
        else return await response.json();
    };

    createAccount = async (account: IAccount): Promise<string[]> => {
        const response = await http("/api/account/create", "POST", {
            account: account,
        });
        if (response.status === 200) return;
        else return await response.json();
    };

    findAccount = async (...where: KeyValuePair<IAccount>[]): Promise<IAccount | undefined> => {
        const response = await http("/api/account/findOne", "POST", {
            where,
        });
        try {
            return await response.json();
        } catch (error) {}
    };

    deleteAccount = async (id: number) => {
        const response = await http("/api/account/delete", "DELETE", {
            id: id,
        });
        if (response.status === 200) return;
        return await response.json();
    };
}

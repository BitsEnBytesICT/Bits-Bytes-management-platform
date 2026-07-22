import {useState} from "react";
import Button from "../../../common/components/Button";
import Input from "../../../common/components/Input";
import PopUp from "../../../common/components/PopUp";

import type IParticipant from "../../../types/compontents/IParticipant";
import ParticipantsService from "../Participants.service";
import type IAccount from "../../../types/accounts/IAccount";
import {PermissionsList} from "../../../types/accounts/accountTypes";
import {Roles} from "../../../types/permissions/rolesList";

type ParticipantPopUpMode = "info" | "add" | "edit";

interface IParticipantPopUp {
    mode: ParticipantPopUpMode;
    participant?: IParticipant;
    onClose: () => void;
    setParticipants?: (value: IParticipant[]) => void;
}

const titles: Record<ParticipantPopUpMode, string> = {
    info: "Deelnemer Info",
    add: "Deelnemer Toevoegen",
    edit: "Deelnemer Bewerken",
};

export default function ParticipantPopUp({mode, participant, onClose, setParticipants}: IParticipantPopUp) {
    const [currentParticipant, setCurrentParticipant] = useState(participant);
    const [password, setPassword] = useState("");
    const [error, setError] = useState([]);
    const isInfo = mode === "info";

    const service: ParticipantsService = new ParticipantsService();

    async function save() {
        if (
            !currentParticipant.firstname ||
            !currentParticipant.lastname ||
            !currentParticipant.organisation ||
            !password
        )
            return;

        let username = `${currentParticipant.firstname}${currentParticipant.lastname[0]}`;
        const duplicateAccount = await service.findAccount(["username", username]);
        if (duplicateAccount) username = `${currentParticipant.firstname}${currentParticipant.lastname.slice(0, 2)}`;

        currentParticipant.createdAt = new Date().toISOString();
        const account: IAccount = {
            type: PermissionsList.participant,
            firstname: currentParticipant.firstname,
            lastname: currentParticipant.lastname,
            username: username,
            role: Roles.admin,
            password: password,
        };
        const error = await service.createAccount(account);
        if (error) {
            setError(error);
            return;
        }
        const error2 = await service.createParticipant(currentParticipant);
        if (error2) {
            const AccountID = (await service.findAccount(["username", account.username])).id;
            await service.deleteAccount(AccountID);
            setError(error2);
            return;
        }

        setParticipants(await service.getParticipants());
        onClose();
    }

    return (
        <PopUp
            onClose={onClose}
            title={titles[mode]}
            child={
                <>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <Input
                            label="Naam"
                            placeholder="Naam"
                            id="firstname"
                            type="text"
                            value={currentParticipant?.firstname}
                            readOnly={isInfo}
                            required={!isInfo}
                            onChange={(value: string) =>
                                setCurrentParticipant({...currentParticipant, firstname: value})
                            }
                        />
                        <Input
                            label="Achternaam"
                            placeholder="Achternaam"
                            id="lastname"
                            type="text"
                            value={currentParticipant?.lastname}
                            readOnly={isInfo}
                            required={!isInfo}
                            onChange={(value: string) =>
                                setCurrentParticipant({...currentParticipant, lastname: value})
                            }
                        />
                        <Input
                            label="Organisatie"
                            placeholder="Organisatie"
                            id="organisation"
                            type="text"
                            value={currentParticipant?.organisation}
                            readOnly={isInfo}
                            required={!isInfo}
                            onChange={(value: string) =>
                                setCurrentParticipant({...currentParticipant, organisation: value})
                            }
                        />
                        <Input
                            label="Actief"
                            id="active"
                            type="checkbox"
                            checked={Boolean(currentParticipant?.active)}
                            readOnly={isInfo}
                            onChange={(value: boolean) =>
                                setCurrentParticipant({...currentParticipant, active: value ? 1 : 0})
                            }
                        />
                        <Input
                            label="Password"
                            placeholder="Password"
                            id="password"
                            type="text"
                            readOnly={isInfo}
                            onChange={(value: string) => setPassword(value)}
                            required={!isInfo}
                        />
                        <Input
                            label="RFID Tag"
                            placeholder="RFID Tag"
                            id="rfid"
                            type="text"
                            value={currentParticipant?.rfid}
                            readOnly={isInfo}
                            onChange={(value: string) => setCurrentParticipant({...currentParticipant, rfid: value})}
                        />
                        {isInfo && (
                            <Input
                                label="Aanwezig"
                                placeholder="Aanwezig"
                                id="clockedin"
                                type="text"
                                value={currentParticipant?.clockedin === 1 ? "Aanwezig" : "Afwezig"}
                                readOnly
                            />
                        )}
                        <Input
                            label="Financiering"
                            placeholder="Financiering"
                            id="financing"
                            type="text"
                            value={currentParticipant?.financing ?? ""}
                            readOnly={isInfo}
                            onChange={(value: string) =>
                                setCurrentParticipant({...currentParticipant, financing: value})
                            }
                        />
                        {isInfo && (
                            <Input label="Plek" placeholder="Plek" id="location" type="text" readOnly={isInfo} />
                        )}
                    </div>

                    {error.length > 0 && (
                        <div className="m-1.5 flex flex-col">
                            {error.map(e => (
                                <span key={e} className="text-[16px] font-semibold text-(--color-red)">
                                    {e}
                                </span>
                            ))}
                        </div>
                    )}
                    <Button
                        onClick={async () => {
                            isInfo ? onClose() : await save();
                        }}>
                        {isInfo ? "Terug" : "Opslaan"}
                    </Button>
                </>
            }
        />
    );
}

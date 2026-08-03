import Button from "../../../common/components/Button";
import Input from "../../../common/components/Input";
import PopUp from "../../../common/components/PopUp";

import type IParticipant from "../../../types/compontents/IParticipant";

type ParticipantPopUpMode = "info" | "add" | "edit";

interface IParticipantPopUp {
    mode: ParticipantPopUpMode;
    participant?: IParticipant;
    onClose: () => void;
}

const titles: Record<ParticipantPopUpMode, string> = {
    info: "Deelnemer Info",
    add: "Deelnemer Toevoegen",
    edit: "Deelnemer Bewerken",
};

export default function ParticipantPopUp({mode, participant, onClose}: IParticipantPopUp) {
    const isInfo = mode === "info";

    function save() {
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
                            value={participant?.firstname}
                            readOnly={isInfo}
                        />
                        <Input
                            label="Achternaam"
                            placeholder="Achternaam"
                            id="lastname"
                            type="text"
                            value={participant?.lastname}
                            readOnly={isInfo}
                        />
                        <Input
                            label="Organisatie"
                            placeholder="Organisatie"
                            id="organisation"
                            type="text"
                            value={participant?.organisation}
                            readOnly={isInfo}
                        />
                        <Input
                            label="Actief"
                            id="active"
                            type="checkbox"
                            checked={Boolean(participant?.active)}
                            readOnly={isInfo}
                        />
                        <Input
                            label="RFID Tag"
                            placeholder="RFID Tag"
                            id="rfid"
                            type="text"
                            value={participant?.rfid}
                            readOnly={isInfo}
                        />
                        {isInfo && (
                            <Input
                                label="Aanwezig"
                                placeholder="Aanwezig"
                                id="clockedin"
                                type="text"
                                value={participant?.clockedin === 1 ? "Aanwezig" : "Afwezig"}
                                readOnly
                            />
                        )}
                        <Input
                            label="Financiering"
                            placeholder="Financiering"
                            id="financing"
                            type="text"
                            value={participant?.financing ?? ""}
                            readOnly={isInfo}
                        />
                        {isInfo && (
                            <Input label="Plek" placeholder="Plek" id="location" type="text" readOnly={isInfo} />
                        )}
                    </div>

                    <Button onClick={isInfo ? onClose : save}>{isInfo ? "Terug" : "Opslaan"}</Button>
                </>
            }
        />
    );
}

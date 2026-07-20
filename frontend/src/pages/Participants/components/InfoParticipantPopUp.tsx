import Input from "../../../common/components/Input";
import PopUp from "../../../common/components/PopUp";

import type IParticipant from "../../../types/compontents/IParticipant";

interface IParticipantInfoPopUp {
    participant: IParticipant;
    onClose: () => void;
}

export default function ParticipantInfoPopUp({participant, onClose}: IParticipantInfoPopUp) {
    return (
        <PopUp onClose={onClose} title="Deelnemer Info">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <Input
                    label="Naam"
                    placeholder="Naam"
                    id="firstname"
                    type="text"
                    value={participant.firstname}
                    readOnly
                />
                <Input
                    label="Achternaam"
                    placeholder="Achternaam"
                    id="lastname"
                    type="text"
                    value={participant.lastname}
                    readOnly
                />
                <Input
                    label="Organisatie"
                    placeholder="Organisatie"
                    id="organisation"
                    type="text"
                    value={participant.organisation}
                    readOnly
                />
                <Input
                    label="Actief"
                    placeholder="Actief"
                    id="active"
                    type="text"
                    value={participant.active ? "Actief" : "Inactief"}
                    readOnly
                />
                <Input
                    label="RFID Tag"
                    placeholder="RFID Tag"
                    id="rfid"
                    type="text"
                    value={participant.rfid}
                    readOnly
                />
                <Input
                    label="Aanwezig"
                    placeholder="Aanwezig"
                    id="clockedin"
                    type="text"
                    value={participant.clockedin === 1 ? "Aanwezig" : "Afwezig"}
                    readOnly
                />
                <Input
                    label="Financiering"
                    placeholder="Financiering"
                    id="financing"
                    type="text"
                    value={participant.financing ?? ""}
                    readOnly
                />
            </div>
        </PopUp>
    );
}

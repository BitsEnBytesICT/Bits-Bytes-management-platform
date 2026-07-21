import Button from "../../../common/components/Button";
import Input from "../../../common/components/Input";
import PopUp from "../../../common/components/PopUp";

import type IParticipant from "../../../types/compontents/IParticipant";

interface IInfoParticipantPopUp {
    participant: IParticipant;
    onClose: () => void;
}

export default function InfoParticipantPopUp({participant, onClose}: IInfoParticipantPopUp) {
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
                <Input label="Actief" id="active" type="checkbox" checked={Boolean(participant.active)} readOnly />
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
                <Input label="Plek" placeholder="Plek" id="location" type="text" readOnly />
            </div>

            <Button onClick={onClose}>Terug</Button>
        </PopUp>
    );
}

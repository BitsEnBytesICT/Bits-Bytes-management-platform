import Button from "../../../common/components/Button";
import Input from "../../../common/components/Input";
import PopUp from "../../../common/components/PopUp";

import type IParticipant from "../../../types/compontents/IParticipant";

interface IEditParticipantPopUp {
    participant: IParticipant;
    onClose: () => void;
}

export default function EditParticipantPopUp({participant, onClose}: IEditParticipantPopUp) {
    function save() {
        console.log("Opslaan");
        onClose();
    }

    return (
        <PopUp onClose={onClose} title="Deelnemer Bewerken">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <Input label="Naam" placeholder="Naam" id="firstname" type="text" value={participant.firstname} />
                <Input
                    label="Achternaam"
                    placeholder="Achternaam"
                    id="lastname"
                    type="text"
                    value={participant.lastname}
                />
                <Input
                    label="Organisatie"
                    placeholder="Organisatie"
                    id="organisation"
                    type="text"
                    value={participant.organisation}
                />
                <Input
                    label="Actief"
                    placeholder="Actief"
                    id="active"
                    type="text"
                    value={participant.active ? "Actief" : "Inactief"}
                />
                <Input label="RFID Tag" placeholder="RFID Tag" id="rfid" type="text" value={participant.rfid} />
                <Input
                    label="Aanwezig"
                    placeholder="Aanwezig"
                    id="clockedin"
                    type="text"
                    value={participant.clockedin === 1 ? "Aanwezig" : "Afwezig"}
                />
                <Input
                    label="Financiering"
                    placeholder="Financiering"
                    id="financing"
                    type="text"
                    value={participant.financing ?? ""}
                />
                <Input label="Plek" placeholder="Plek" id="location" type="text" />
            </div>

            <Button onClick={save}>Opslaan</Button>
        </PopUp>
    );
}

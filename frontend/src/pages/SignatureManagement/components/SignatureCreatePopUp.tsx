import {useState} from "react";
import Button from "../../../common/components/Button";
import PopUp from "../../../common/components/PopUp";
import Input from "../../../common/components/Input";

import SignatureManagementService from "../SignatureManagentService";
import SignatureCanvas, {type Point} from "./SignatureCanvas";

import {IconCalendarAfter, IconCalendarBefore} from "../../../assets";
import type {IParticipant} from "../../../types/compontents/IParticipant";

interface ISignatureCreatePopUp {
    participants: IParticipant[];
    onClose: () => void;
    onSaved?: () => Promise<void> | void;
}

export default function SignatureCreatePopUp({participants, onClose, onSaved}: ISignatureCreatePopUp) {
    const [participantID, setParticipantID] = useState("");
    const [clockinDate, setClockinDate] = useState("");
    const [clockoutDate, setClockoutDate] = useState("");
    const [strokes, setStrokes] = useState<Point[][]>([]);
    const [signature, setSignature] = useState("");
    const [error, setError] = useState<string[]>([]);

    const service: SignatureManagementService = new SignatureManagementService();

    async function save() {
        if (!participantID || !clockinDate || !clockoutDate || !signature) {
            setError(["De velden met * zijn verplicht"]);
            return;
        }

        if (new Date(clockoutDate) < new Date(clockinDate)) {
            setError(["Uitgeklokt moet na ingeklokt zijn"]);
            return;
        }

        const error = await service.createSignature({
            participantID: Number(participantID),
            clockinDate: new Date(clockinDate),
            clockoutDate: new Date(clockoutDate),
            signature: signature,
        });
        if (error) {
            setError(error);
            return;
        }

        await onSaved?.();
        onClose();
    }

    return (
        <PopUp
            onClose={onClose}
            title="Handmatig Toevoegen"
            errors={error}
            children={[
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        id="participant"
                        type="select"
                        label="Deelnemer"
                        required
                        className="col-span-2"
                        placeholder="Kies een deelnemer"
                        options={participants.map(participant => ({
                            value: String(participant.id),
                            label: `${participant.firstname} ${participant.lastname}`,
                        }))}
                        value={participantID}
                        onChange={setParticipantID}
                    />
                    <Input
                        id="clockinDate"
                        type="datetime-local"
                        label="Ingeklokt"
                        required
                        value={clockinDate}
                        max={clockoutDate || undefined}
                        icon={IconCalendarAfter}
                        onChange={setClockinDate}
                    />

                    <Input
                        id="clockoutDate"
                        type="datetime-local"
                        label="Uitgeklokt"
                        required
                        value={clockoutDate}
                        min={clockinDate || undefined}
                        icon={IconCalendarBefore}
                        onChange={setClockoutDate}
                    />
                </div>,
                <SignatureCanvas
                    strokes={strokes}
                    onChange={(strokes, svg) => {
                        setStrokes(strokes);
                        setSignature(svg);
                    }}
                />,
            ]}
            button={<Button onClick={save}>Toevoegen</Button>}
        />
    );
}

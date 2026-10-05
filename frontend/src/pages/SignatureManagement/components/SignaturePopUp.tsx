import {useState} from "react";
import Button from "../../../common/components/Button";
import Input from "../../../common/components/Input";
import PopUp from "../../../common/components/PopUp";

import {formatDate} from "../../../common/helperFunctions";

import type IAttendance from "../../../types/compontents/IAttendance";
import SignatureManagementService from "../SignatureManagentService";
import SignatureCanvas, {type Point} from "./SignatureCanvas";
import type {IParticipant} from "../../../types/compontents/IParticipant";

type SignaturePopUpMode = "info" | "edit";

interface ISignaturePopUp {
    mode: SignaturePopUpMode;
    signature: IAttendance;
    participant?: IParticipant;
    onClose: () => void;
    onSaved?: () => Promise<void> | void;
}

const titles: Record<SignaturePopUpMode, string> = {
    info: "Handtekening Info",
    edit: "Handtekening Bewerken",
};

export default function SignaturePopUp({mode, signature, participant, onClose, onSaved}: ISignaturePopUp) {
    const [strokes, setStrokes] = useState<Point[][]>([]);
    const [currentSignature, setCurrentSignature] = useState(signature.signature);
    const [error, setError] = useState<string[]>([]);
    const isInfo = mode === "info";

    const service: SignatureManagementService = new SignatureManagementService();

    async function save() {
        if (!currentSignature) {
            setError(["Zet eerst een handtekening"]);
            return;
        }

        if (currentSignature === signature.signature) {
            onClose();
            return;
        }

        const error = await service.updateSignature(signature.id, currentSignature);
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
            title={titles[mode]}
            errors={error}
            children={[
                <>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <Input
                            label="Deelnemer"
                            placeholder="Deelnemer"
                            id="participant"
                            type="text"
                            value={
                                participant
                                    ? `${participant.firstname} ${participant.lastname}`
                                    : `${signature.participantID}`
                            }
                            readOnly
                        />
                        <Input
                            label="Organisatie"
                            placeholder="Organisatie"
                            id="organisation"
                            type="text"
                            value={participant?.organisation ?? "-"}
                            readOnly
                        />
                        <Input
                            label="Ingeklokt"
                            placeholder="Ingeklokt"
                            id="clockinDate"
                            type="text"
                            value={formatDate(signature.clockinDate)}
                            readOnly
                        />
                        <Input
                            label="Uitgeklokt"
                            placeholder="Uitgeklokt"
                            id="clockoutDate"
                            type="text"
                            value={formatDate(signature.clockoutDate)}
                            readOnly
                        />
                        <Input
                            label="Werkduur (min)"
                            placeholder="Werkduur"
                            id="workDuration"
                            type="text"
                            value={signature.workDuration != null ? `${signature.workDuration}` : "-"}
                            readOnly
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="ml-1.5 text-[16px] font-semibold text-(--color-darkblue)">Handtekening</span>
                        <div
                            className="h-32 flex items-center justify-center bg-(--color-offwhite) rounded-xl
                                shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                            {currentSignature ? (
                                <img
                                    src={`data:image/svg+xml;utf8,${encodeURIComponent(currentSignature)}`}
                                    className="max-h-full max-w-full select-none [-webkit-user-drag:none]"
                                />
                            ) : (
                                <span className="text-(--color-offblack)/50">Geen handtekening</span>
                            )}
                        </div>
                    </div>
                </>,
                ...(isInfo
                    ? []
                    : [
                          <SignatureCanvas
                              strokes={strokes}
                              onChange={(strokes, svg) => {
                                  setStrokes(strokes);
                                  // Clearing the canvas falls back to the existing signature
                                  setCurrentSignature(svg || signature.signature);
                                  setError([]);
                              }}
                          />,
                      ]),
            ]}
            button={<Button onClick={isInfo ? onClose : save}>{isInfo ? "Terug" : "Bewerken"}</Button>}
        />
    );
}

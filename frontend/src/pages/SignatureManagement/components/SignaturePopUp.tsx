import {useEffect, useState} from "react";
import Button from "../../../common/components/Button";
import Input from "../../../common/components/Input";
import PopUp from "../../../common/components/PopUp";

import type IAttendance from "../../../types/compontents/IAttendance";
import type IParticipant from "../../../types/compontents/IParticipant";
import SignatureManagementService from "../SignatureManagentService";
import SignatureCanvasPopUp from "./SignatureCanvasPopUp";

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
    const [currentSignature, setCurrentSignature] = useState(signature.signature);
    const [error, setError] = useState<string[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const isInfo = mode === "info";

    const service: SignatureManagementService = new SignatureManagementService();

    useEffect(() => {
        if (isInfo) {
            return;
        }

        if (!currentSignature) {
            setError(["De velden met * zijn verplicht"]);
        } else {
            setError([]);
        }
    }, [currentSignature]);

    async function save() {
        if (!currentSignature) return;

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
            child={
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
                            value={signature.clockinDate}
                            readOnly
                        />
                        <Input
                            label="Uitgeklokt"
                            placeholder="Uitgeklokt"
                            id="clockoutDate"
                            type="text"
                            value={signature.clockoutDate ?? "-"}
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
                        <span className="ml-1.5 text-[16px] font-semibold text-(--color-darkblue)">
                            {`Handtekening ${isInfo ? "" : "*"}`}
                        </span>
                        <div
                            onClick={() => !isInfo && setIsDrawing(true)}
                            title={isInfo ? undefined : "Klik om opnieuw te tekenen"}
                            className={`h-32 flex items-center justify-center bg-(--color-offwhite) rounded-xl
                            shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]
                            ${isInfo ? "" : "cursor-pointer transition-shadow hover:shadow-[inset_0_0_0_1px_var(--color-darkblue)]"}`}>
                            {currentSignature ? (
                                <img
                                    src={`data:image/svg+xml;utf8,${encodeURIComponent(currentSignature)}`}
                                    className="max-h-full max-w-full select-none [-webkit-user-drag:none]"
                                />
                            ) : (
                                <span className="text-(--color-offblack)/50">
                                    {isInfo ? "Geen handtekening" : "Klik om te tekenen"}
                                </span>
                            )}
                        </div>
                    </div>

                    {isDrawing && (
                        <SignatureCanvasPopUp
                            onClose={() => setIsDrawing(false)}
                            onSave={(svg: string) => setCurrentSignature(svg)}
                        />
                    )}

                    <div className="flex flex-col h-6">
                        {error &&
                            error.map(e => (
                                <span
                                    key={e}
                                    className="text-[16px] font-semibold text-(--color-red)
                                        animate-[fade-in_0.3s_ease-in-out]">
                                    {e}
                                </span>
                            ))}
                    </div>
                    <div className="mt-auto">
                        <Button
                            onClick={async () => {
                                isInfo ? onClose() : await save();
                            }}>
                            {isInfo ? "Terug" : "Bewerken"}
                        </Button>
                    </div>
                </>
            }
        />
    );
}

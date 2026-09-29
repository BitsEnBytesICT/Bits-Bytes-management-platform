import {useState} from "react";
import Button from "../../../common/components/Button";
import PopUp from "../../../common/components/PopUp";

import type IParticipant from "../../../types/compontents/IParticipant";
import SignatureManagementService from "../SignatureManagentService";
import SignatureCanvasPopUp from "./SignatureCanvasPopUp";

interface ISignatureCreatePopUp {
    participants: IParticipant[];
    onClose: () => void;
    onSaved?: () => Promise<void> | void;
}

const dateInputClassName = `px-[15px] py-3 font-normal text-(--color-offblack) bg-(--color-offwhite) outline-none
    rounded-xl cursor-pointer transition-colors
    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]
    focus:shadow-[inset_0_0_0_1px_var(--color-darkblue)]`;

export default function SignatureCreatePopUp({participants, onClose, onSaved}: ISignatureCreatePopUp) {
    const [participantID, setParticipantID] = useState("");
    const [clockinDate, setClockinDate] = useState("");
    const [clockoutDate, setClockoutDate] = useState("");
    const [signature, setSignature] = useState("");
    const [error, setError] = useState<string[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);

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
            child={
                <>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div className="col-span-2 flex flex-col gap-2">
                            <label
                                className="ml-1.5 text-[16px] font-semibold text-(--color-darkblue)"
                                htmlFor="participant">
                                Deelnemer *
                            </label>
                            <select
                                id="participant"
                                value={participantID}
                                onChange={e => setParticipantID(e.target.value)}
                                className="px-5 py-3 text-[16px] text-(--color-offblack) bg-(--color-offwhite)
                                    outline-none rounded-xl cursor-pointer transition-colors
                                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]
                                    focus:shadow-[inset_0_0_0_1px_var(--color-darkblue)]">
                                <option value="" disabled>
                                    Kies een deelnemer
                                </option>
                                {participants.map(participant => (
                                    <option key={participant.id} value={participant.id}>
                                        {`${participant.firstname} ${participant.lastname}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <label className="flex flex-col gap-2 text-[16px] font-semibold text-(--color-darkblue)">
                            <span className="ml-1.5">Ingeklokt *</span>
                            <input
                                id="clockinDate"
                                type="datetime-local"
                                value={clockinDate}
                                max={clockoutDate || undefined}
                                onChange={e => setClockinDate(e.target.value)}
                                className={dateInputClassName}
                            />
                        </label>
                        <label className="flex flex-col gap-2 text-[16px] font-semibold text-(--color-darkblue)">
                            <span className="ml-1.5">Uitgeklokt *</span>
                            <input
                                id="clockoutDate"
                                type="datetime-local"
                                value={clockoutDate}
                                min={clockinDate || undefined}
                                onChange={e => setClockoutDate(e.target.value)}
                                className={dateInputClassName}
                            />
                        </label>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="ml-1.5 text-[16px] font-semibold text-(--color-darkblue)">Handtekening *</span>
                        <div
                            onClick={() => setIsDrawing(true)}
                            title="Klik om te tekenen"
                            className="h-32 flex items-center justify-center bg-(--color-offwhite) rounded-xl
                                cursor-pointer transition-shadow
                                shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]
                                hover:shadow-[inset_0_0_0_1px_var(--color-darkblue)]">
                            {signature ? (
                                <img
                                    src={`data:image/svg+xml;utf8,${encodeURIComponent(signature)}`}
                                    className="max-h-full max-w-full select-none [-webkit-user-drag:none]"
                                />
                            ) : (
                                <span className="text-(--color-offblack)/50">Klik om te tekenen</span>
                            )}
                        </div>
                    </div>

                    {isDrawing && (
                        <SignatureCanvasPopUp
                            onClose={() => setIsDrawing(false)}
                            onSave={(svg: string) => setSignature(svg)}
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
                        <Button onClick={save}>Toevoegen</Button>
                    </div>
                </>
            }
        />
    );
}

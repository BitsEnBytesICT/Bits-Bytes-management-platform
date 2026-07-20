import {useState} from "react";

import Button from "../../../common/components/Button";
import Input from "../../../common/components/Input";
import PopUp from "../../../common/components/PopUp";

interface IAddParticipantPopUp {
    onClose: () => void;
}

export default function AddParticipantPopUp({onClose}: IAddParticipantPopUp) {
    const [step, setStep] = useState(0);

    const steps = [
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Input label="Naam" placeholder="Naam" id="firstname" type="text" />
            <Input label="Achternaam" placeholder="Achternaam" id="lastname" type="text" />
            <Input label="Organisatie" placeholder="Organisatie" id="organisation" type="text" />
        </div>,
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Input label="Actief" placeholder="Actief" id="active" type="text" />
            <Input label="RFID Tag" placeholder="RFID Tag" id="rfid" type="text" />
            <Input label="Aanwezig" placeholder="Aanwezig" id="clockedin" type="text" />
        </div>,
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Input label="Financiering" placeholder="Financiering" id="financing" type="text" />
            <Input label="Plek" placeholder="Plek" id="location" type="text" />
        </div>,
    ];

    const isLastStep = step === steps.length - 1;

    function close() {
        onClose();
        setStep(0);
    }

    function goToNextStep() {
        if (isLastStep) {
            console.log("Opslaan");
            close();
            return;
        }

        setStep(current => current + 1);
    }

    return (
        <PopUp onClose={close} title="Deelnemer Toevoegen">
            {steps[step]}

            <div className="flex flex-row items-center gap-4">
                {step > 0 && (
                    <button
                        onClick={() => setStep(current => current - 1)}
                        className="text-(--color-darkblue) cursor-pointer">
                        Vorige
                    </button>
                )}

                <div className="flex-1">
                    <Button onClick={goToNextStep}>{isLastStep ? "Opslaan" : "Volgende"}</Button>
                </div>
            </div>
        </PopUp>
    );
}

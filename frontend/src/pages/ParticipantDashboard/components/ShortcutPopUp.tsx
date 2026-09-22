import {useState, type FormEvent} from "react";
import Button from "../../../common/components/Button";
import Input from "../../../common/components/Input";
import PopUp from "../../../common/components/PopUp";
import SmallButton from "../../../common/components/SmallButton";
import type IShortcut from "../../../types/participantDashboard/IShortcut";
import ParticipantDashboardService from "../ParticipantDashboard.service";

interface IShortcutPopUp {
    shortcut?: IShortcut;
    onSave: (shortcut: Pick<IShortcut, "label" | "url">) => void;
    onClose: () => void;
}

const service = new ParticipantDashboardService();

export default function ShortcutPopUp({shortcut, onSave, onClose}: IShortcutPopUp) {
    const [label, setLabel] = useState(shortcut?.label ?? "");
    const [website, setWebsite] = useState(shortcut?.url ?? "");
    const [error, setError] = useState("");

    function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const validated = service.validateShortcut(label, website);
            onSave(validated);
        } catch (error) {
            setError(error instanceof Error ? error.message : "De snelkoppeling kon niet worden opgeslagen.");
        }
    }

    return (
        <PopUp
            compact
            title={shortcut ? "Snelkoppeling bewerken" : "Snelkoppeling toevoegen"}
            onClose={onClose}
            child={
                <form onSubmit={onSubmit} className="flex flex-col gap-6">
                    <Input id="shortcut-name" type="text" label="Naam" value={label} onChange={setLabel} required />
                    <Input
                        id="shortcut-website"
                        type="text"
                        label="Website"
                        placeholder="https://voorbeeld.nl"
                        value={website}
                        onChange={setWebsite}
                        required
                    />
                    <p className="text-sm text-(--color-offblack)/70">
                        Snelkoppelingen worden alleen in deze browser bewaard.
                    </p>
                    {error && (
                        <p role="alert" className="text-sm text-(--color-red)">
                            {error}
                        </p>
                    )}
                    <div className="flex items-center gap-5">
                        <SmallButton label="Annuleren" onClick={onClose} />
                        <Button>Opslaan</Button>
                    </div>
                </form>
            }
        />
    );
}

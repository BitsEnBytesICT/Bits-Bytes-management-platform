import {useRef, useState} from "react";
import SmallPopUp from "../../../common/components/SmallPopUp";
import useLocalStorage from "../../../common/hooks/useLocalStorage";
import type IShortcut from "../../../types/participantDashboard/IShortcut";
import ParticipantDashboardService, {SHORTCUTS_STORAGE_KEY} from "../ParticipantDashboard.service";
import ShortcutPopUp from "./ShortcutPopUp";
import ShortcutTile from "./ShortcutTile";

const service = new ParticipantDashboardService();

export default function ShortcutSection() {
    const [storedShortcuts, setStoredShortcuts] = useLocalStorage<unknown>(SHORTCUTS_STORAGE_KEY, []);
    const [editing, setEditing] = useState<IShortcut | "new" | null>(null);
    const [deleting, setDeleting] = useState<IShortcut | null>(null);
    const [storageUnavailable, setStorageUnavailable] = useState(false);
    const addButton = useRef<HTMLButtonElement>(null);
    const shortcuts = service.readShortcuts(storedShortcuts);

    function saveShortcuts(value: IShortcut[]) {
        setStorageUnavailable(!setStoredShortcuts(value));
    }

    function saveShortcut(value: Pick<IShortcut, "label" | "url">) {
        if (!editing) return;

        if (editing === "new") {
            saveShortcuts([...shortcuts, {id: crypto.randomUUID(), ...value}]);
        } else {
            saveShortcuts(shortcuts.map(shortcut => (shortcut.id === editing.id ? {...shortcut, ...value} : shortcut)));
        }

        setEditing(null);
    }

    function deleteShortcut() {
        if (!deleting) return;

        saveShortcuts(shortcuts.filter(shortcut => shortcut.id !== deleting.id));
        setDeleting(null);
        // The deleted tile cannot receive focus when its confirmation dialog closes.
        requestAnimationFrame(() => addButton.current?.focus());
    }

    return (
        <section aria-labelledby="shortcuts-heading" className="mt-37.5">
            <h2 id="shortcuts-heading" className="text-[22px] leading-7 font-semibold text-(--color-darkblue)">
                Jouw snelkoppelingen:
            </h2>

            <div className="mt-8.75 grid min-h-60 grid-cols-[repeat(auto-fill,170px)] content-start gap-x-12.5 gap-y-10">
                {shortcuts.map(shortcut => (
                    <ShortcutTile
                        key={shortcut.id}
                        shortcut={shortcut}
                        onEdit={() => setEditing(shortcut)}
                        onDelete={() => setDeleting(shortcut)}
                    />
                ))}
                <button
                    ref={addButton}
                    type="button"
                    aria-label="Snelkoppeling toevoegen"
                    onClick={() => setEditing("new")}
                    className="flex h-25 w-42.5 items-center justify-center rounded-[7.5px] border
                        border-(--color-black)/5 bg-(--color-white) cursor-pointer transition-colors duration-300
                        hover:bg-(--color-darkblue)/5 focus-visible:outline-2 focus-visible:outline-offset-4
                        focus-visible:outline-(--color-darkblue) motion-reduce:transition-none">
                    <span aria-hidden="true" className="relative flex h-10 w-10 items-center justify-center">
                        <span className="absolute h-[3.5px] w-[28px] rounded-full bg-(--color-darkblue)" />
                        <span className="absolute h-[28px] w-[3.5px] rounded-full bg-(--color-darkblue)" />
                    </span>
                </button>
            </div>

            {storageUnavailable && (
                <p role="status" className="mt-4 text-sm text-(--color-offblack)">
                    Je browser kan deze wijzigingen niet bewaren. Ze blijven beschikbaar zolang deze pagina open is.
                </p>
            )}

            {editing && (
                <ShortcutPopUp
                    shortcut={editing === "new" ? undefined : editing}
                    onSave={saveShortcut}
                    onClose={() => setEditing(null)}
                />
            )}

            {deleting && (
                <SmallPopUp
                    title="Verwijderen?"
                    message={`Wil je de snelkoppeling naar ${deleting.label} verwijderen?`}
                    onConfirm={deleteShortcut}
                    onCancel={() => setDeleting(null)}
                />
            )}
        </section>
    );
}

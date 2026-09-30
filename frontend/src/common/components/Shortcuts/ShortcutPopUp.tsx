import {useState} from "react";

import Button from "../Button";
import Input from "../Input";
import PopUp from "../PopUp";

import ShortcutService from "./Shortcut.service";

import type IShortcut from "../../../types/accounts/IShortcut";
import type IShortcutPopUp from "../../../types/compontents/IShortcutPopUp";

import {IconDelete, IconEdit} from "../../../assets";

export default function ShortcutPopUp({shortcuts, onClose, onSaved}: IShortcutPopUp) {
    const [editIndex, setEditIndex] = useState<number>();
    const [label, setLabel] = useState("");
    const [url, setUrl] = useState("");
    const [errors, setErrors] = useState<string[]>([]);

    const service = new ShortcutService();

    const isEditing = editIndex !== undefined;

    function openForm(index?: number) {
        setLabel(index === undefined ? "" : shortcuts[index].label);
        setUrl(index === undefined ? "" : shortcuts[index].url);
        setEditIndex(index ?? shortcuts.length);
        setErrors([]);
    }

    function closeForm() {
        setEditIndex(undefined);
        setErrors([]);
    }

    async function store(updated: IShortcut[]): Promise<void> {
        const result = await service.updateShortcuts(updated);
        if (result) {
            setErrors(result);
            return;
        }

        await onSaved();
        setEditIndex(undefined);
        setErrors([]);
    }

    async function handleSave(): Promise<void> {
        if (!label || !url) {
            setErrors(["Naam en link zijn verplicht"]);
            return;
        }

        if (label.length > 50) {
            setErrors(["Naam mag niet langer zijn dan 50 tekens"]);
            return;
        }

        const updated = [...shortcuts];
        updated[editIndex!] = {label: label, url: url};

        await store(updated);
    }

    return (
        <PopUp
            onClose={onClose}
            title="Snelkoppelingen beheren"
            child={
                isEditing ? (
                    <div className="flex flex-col justify-between grow">
                        <div className="flex flex-col gap-7">
                            <Input
                                id="shortcutLabel"
                                type="text"
                                label="Naam"
                                required
                                value={label}
                                onChange={setLabel}
                            />

                            <Input
                                id="shortcutUrl"
                                type="text"
                                label="Link"
                                required
                                placeholder="https://www.voorbeeld.nl"
                                value={url}
                                onChange={setUrl}
                            />

                            {errors.length > 0 && (
                                <div
                                    className="flex flex-col gap-1 text-(--color-red)
                                        animate-[fade-in_0.3s_ease-in-out]">
                                    {errors.map(error => (
                                        <div key={error}>{error}</div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button onClick={closeForm}>Terug</Button>

                            <Button onClick={handleSave}>Opslaan</Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-between grow">
                        <div className="flex flex-col gap-3 max-h-100 overflow-auto">
                            {shortcuts.map((shortcut, index) => (
                                <div
                                    key={shortcut.url}
                                    className="px-[15px] py-3 flex flex-row gap-4 items-center bg-(--color-offwhite)
                                        rounded-xl
                                        shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                                    <span
                                        className="min-w-0 grow font-semibold text-(--color-darkblue) truncate
                                            select-none">
                                        {shortcut.label}
                                    </span>

                                    <img
                                        onClick={() => openForm(index)}
                                        src={IconEdit}
                                        title="Aanpassen"
                                        className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
                                    />

                                    <img
                                        onClick={() => store(shortcuts.filter((_, i) => i !== index))}
                                        src={IconDelete}
                                        title="Verwijderen"
                                        className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
                                    />
                                </div>
                            ))}

                            {shortcuts.length === 0 && (
                                <div className="text-(--color-darkblue)/50">Nog geen snelkoppelingen toegevoegd</div>
                            )}
                        </div>

                        {errors.length > 0 && (
                            <div className="flex flex-col gap-1 text-(--color-red) animate-[fade-in_0.3s_ease-in-out]">
                                {errors.map(error => (
                                    <div key={error}>{error}</div>
                                ))}
                            </div>
                        )}

                        <Button onClick={() => openForm()}>Snelkoppeling toevoegen</Button>
                    </div>
                )
            }
        />
    );
}

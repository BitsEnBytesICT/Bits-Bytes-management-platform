import {useState} from "react";

import Button from "../Button";
import Input from "../Input";
import PopUp from "../PopUp";
import SmallPopUp from "../SmallPopUp";

import ShortcutService from "./Shortcut.service";

import type IShortcut from "../../../types/accounts/IShortcut";
import type IShortcutPopUp from "../../../types/compontents/IShortcutPopUp";

import {IconDelete, IconEdit} from "../../../assets";

export default function ShortcutPopUp({shortcuts, onClose, onSaved}: IShortcutPopUp) {
    const [editIndex, setEditIndex] = useState<number>();
    const [label, setLabel] = useState("");
    const [url, setUrl] = useState("");
    const [deleteIndex, setDeleteIndex] = useState<number>();
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
        <>
            <PopUp
                onClose={onClose}
                title="Snelkoppelingen beheren"
                errors={errors}
                children={[
                    isEditing ? (
                        <div className="flex flex-col gap-7 grow">
                            <Input
                                id="shortcutLabel"
                                type="text"
                                label="Naam"
                                required
                                placeholder="Naam van de website"
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
                                onChange={value =>
                                    value.indexOf("https://") !== -1 ? setUrl(value) : setUrl(`https://${value}`)
                                }
                            />
                        </div>
                    ) : (
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
                                        onClick={() => setDeleteIndex(index)}
                                        src={IconDelete}
                                        title="Verwijderen"
                                        className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
                                    />
                                </div>
                            ))}
                        </div>
                    ),
                ]}
                button={
                    isEditing ? (
                        <>
                            <Button onClick={closeForm}>Terug</Button>

                            <Button onClick={handleSave}>Opslaan</Button>
                        </>
                    ) : (
                        <Button onClick={() => openForm()}>Snelkoppeling toevoegen</Button>
                    )
                }
            />

            {deleteIndex !== undefined && (
                <SmallPopUp
                    nested
                    title="Verwijderen"
                    message={`Weet je zeker dat je de snelkoppeling "${shortcuts[deleteIndex].label}" wil verwijderen?`}
                    onCancel={() => setDeleteIndex(undefined)}
                    onConfirm={async () => {
                        await store(shortcuts.filter((_, i) => i !== deleteIndex));
                        setDeleteIndex(undefined);
                    }}
                />
            )}
        </>
    );
}

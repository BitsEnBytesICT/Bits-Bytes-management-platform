import {useState} from "react";

import Button from "../Button";
import Input from "../Input";
import PopUp from "../PopUp";
import SmallPopUp from "../SmallPopUp";

import CalendarService from "./Calendar.service";

import type ICalendar from "../../../types/accounts/ICalendar";
import type ICalendarPopUp from "../../../types/compontents/ICalendarPopUp";

import {IconDelete, IconEdit} from "../../../assets";

export default function CalendarPopUp({calendars, onClose, onSaved}: ICalendarPopUp) {
    const [editIndex, setEditIndex] = useState<number>();
    const [label, setLabel] = useState("");
    const [url, setUrl] = useState("");
    const [deleteIndex, setDeleteIndex] = useState<number>();
    const [errors, setErrors] = useState<string[]>([]);

    const service = new CalendarService();
    const isEditing = editIndex !== undefined;

    function openForm(index?: number) {
        setLabel(index === undefined ? "" : calendars[index].label);
        setUrl(index === undefined ? "" : calendars[index].url);
        setEditIndex(index ?? calendars.length);
        setErrors([]);
    }

    function closeForm() {
        setEditIndex(undefined);
        setErrors([]);
    }

    async function store(updated: ICalendar[]) {
        const result = await service.updateCalendars(updated);
        if (result) {
            setErrors(result);
            return;
        }

        await onSaved();
        setEditIndex(undefined);
        setErrors([]);
    }

    async function save() {
        if (!label || !url) {
            setErrors(["Naam en link zijn verplicht"]);
            return;
        }

        if (label.length > 50) {
            setErrors(["Naam mag niet langer zijn dan 50 tekens"]);
            return;
        }

        const updated = [...calendars];
        updated[editIndex!] = {label: label, url: url};

        await store(updated);
    }

    return (
        <>
            <PopUp
                onClose={onClose}
                title="Agenda's beheren"
                child={
                    isEditing ? (
                        <div className="flex flex-col justify-between grow">
                            <div className="flex flex-col gap-7">
                                <Input
                                    id="calendarLabel"
                                    type="text"
                                    label="Naam"
                                    required
                                    placeholder="Naam van de agenda"
                                    value={label}
                                    onChange={setLabel}
                                />

                                <Input
                                    id="calendarUrl"
                                    type="text"
                                    label="Link"
                                    required
                                    placeholder="https://calendar.google.com/calendar/embed?src=..."
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

                                <Button onClick={save}>Opslaan</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-7 grow">
                            <div className="flex flex-col gap-3 max-h-100 overflow-auto">
                                {calendars.map((calendar, index) => (
                                    <div
                                        key={calendar.url}
                                        className="px-[15px] py-3 flex flex-row gap-4 items-center bg-(--color-offwhite)
                                            rounded-xl
                                            shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                                        <span
                                            className="min-w-0 grow font-semibold text-(--color-darkblue) truncate
                                                select-none">
                                            {calendar.label}
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

                            {errors.length > 0 && (
                                <div
                                    className="flex flex-col gap-1 text-(--color-red)
                                        animate-[fade-in_0.3s_ease-in-out]">
                                    {errors.map(error => (
                                        <div key={error}>{error}</div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-auto">
                                <Button onClick={() => openForm()}>Agenda toevoegen</Button>
                            </div>
                        </div>
                    )
                }
            />

            {deleteIndex !== undefined && (
                <SmallPopUp
                    nested
                    title="Verwijderen"
                    message={`Weet je zeker dat je de agenda "${calendars[deleteIndex].label}" wil verwijderen?`}
                    onCancel={() => setDeleteIndex(undefined)}
                    onConfirm={async () => {
                        await store(calendars.filter((_, i) => i !== deleteIndex));
                        setDeleteIndex(undefined);
                    }}
                />
            )}
        </>
    );
}

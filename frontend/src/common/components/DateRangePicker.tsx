import {useEffect, useRef, useState} from "react";

import SmallButton from "./SmallButton";
import Input from "./Input";

import type IDateRangePicker from "../../types/compontents/IDateRangePicker";

import {IconCalendar, IconCalendarAfter, IconCalendarBefore} from "../../assets";

const inputClassName = `px-3 py-2 bg-(--color-offwhite) rounded-lg
    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]`;

const iconClassName = "right-3";

function formatDay(value: string): string {
    return new Date(`${value}T00:00`).toLocaleDateString("nl-NL", {dateStyle: "short"});
}

function rangeLabel(from: string, to: string): string {
    if (from && to) return from === to ? formatDay(from) : `${formatDay(from)} – ${formatDay(to)}`;
    if (from) return `Vanaf ${formatDay(from)}`;
    if (to) return `Tot ${formatDay(to)}`;

    return "Datum kiezen";
}

export default function DateRangePicker({value, onChange}: IDateRangePicker) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const onMouseDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
        };
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative w-fit">
            <SmallButton
                onClick={() => setIsOpen(prev => !prev)}
                icon={<img src={IconCalendar} className="select-none [-webkit-user-drag:none]" />}
                label={rangeLabel(value.from, value.to)}
                active={isOpen || Boolean(value.from || value.to)}
            />

            {isOpen && (
                <div
                    className="absolute top-full left-0 z-10 mt-2 p-4 flex flex-col gap-3 w-60 min-w-full text-sm
                        font-semibold text-(--color-darkblue) bg-(--color-white) rounded-lg
                        shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                    <Input
                        id="dateFrom"
                        type="date"
                        label="Van"
                        labelClassName="opacity-50"
                        value={value.from}
                        max={value.to}
                        icon={IconCalendarAfter}
                        className={inputClassName}
                        iconClassName={iconClassName}
                        onChange={from => onChange({...value, from})}
                    />

                    <Input
                        id="dateTo"
                        type="date"
                        label="Tot en met"
                        labelClassName="opacity-50"
                        value={value.to}
                        min={value.from}
                        icon={IconCalendarBefore}
                        className={inputClassName}
                        iconClassName={iconClassName}
                        onChange={to => onChange({...value, to})}
                    />

                    <button onClick={() => onChange({from: "", to: ""})} className="mr-auto cursor-pointer">
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
}

import {useEffect, useRef, useState} from "react";

import SmallButton from "./SmallButton";

import type IDateRangePicker from "../../types/compontents/IDateRangePicker";

import {IconCalendar, IconCalendarAfter, IconCalendarBefore} from "../../assets";

const inputClassName = `px-3 py-2 w-full bg-(--color-offwhite) rounded-lg outline-none cursor-pointer
    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]
    focus:shadow-[inset_0_0_0_1px_var(--color-darkblue)]
    [&::-webkit-calendar-picker-indicator]:size-5
    [&::-webkit-calendar-picker-indicator]:opacity-0
    [&::-webkit-calendar-picker-indicator]:cursor-pointer`;

const iconClassName = `absolute right-3 top-1/2 -translate-y-1/2 size-[18px] pointer-events-none select-none
    [-webkit-user-drag:none]`;

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
        <div ref={containerRef} className="relative">
            <SmallButton
                onClick={() => setIsOpen(prev => !prev)}
                icon={<img src={IconCalendar} className="select-none [-webkit-user-drag:none]" />}
                label={rangeLabel(value.from, value.to)}
                active={isOpen || Boolean(value.from || value.to)}
            />

            {isOpen && (
                <div
                    className="absolute top-full left-0 z-10 mt-2 p-4 flex flex-col gap-3 text-sm font-semibold
                        text-(--color-darkblue) bg-(--color-white) rounded-lg shadow-lg
                        shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                    <label className="flex flex-col gap-1">
                        <span className="opacity-50">Van</span>
                        <div className="relative">
                            <input
                                type="date"
                                value={value.from}
                                max={value.to}
                                onChange={event => onChange({...value, from: event.target.value})}
                                className={inputClassName}
                            />

                            <img src={IconCalendarAfter} className={iconClassName} />
                        </div>
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="opacity-50">Tot en met</span>
                        <div className="relative">
                            <input
                                type="date"
                                value={value.to}
                                min={value.from}
                                onChange={event => onChange({...value, to: event.target.value})}
                                className={inputClassName}
                            />

                            <img src={IconCalendarBefore} className={iconClassName} />
                        </div>
                    </label>

                    <button onClick={() => onChange({from: "", to: ""})} className="mr-auto cursor-pointer">
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
}

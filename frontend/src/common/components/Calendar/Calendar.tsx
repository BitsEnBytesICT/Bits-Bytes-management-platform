import {useEffect, useState} from "react";

import SmallButton from "../SmallButton";
import CalendarPopUp from "./CalendarPopUp";

import CalendarService from "./Calendar.service";

import type ICalendar from "../../../types/accounts/ICalendar";

import {IconCalendar, IconEdit} from "../../../assets";

export default function Calendar() {
    const [calendars, setCalendars] = useState<ICalendar[]>([]);
    const [active, setActive] = useState(0);
    const [isManageShown, setIsManageShown] = useState(false);

    const service = new CalendarService();

    useEffect(() => {
        getCalendars();
    }, []);

    async function getCalendars() {
        const calendars = await service.getCalendars();
        setCalendars(calendars);
        setActive(previous => Math.min(previous, Math.max(calendars.length - 1, 0)));
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-hidden">
                {calendars.length > 0 ? (
                    <div
                        style={{
                            width: `${calendars.length * 100}%`,
                            transform: `translateX(-${(active * 100) / calendars.length}%)`,
                        }}
                        className="flex transition-transform duration-400 ease-in-out">
                        {calendars.map(calendar => (
                            <iframe
                                key={calendar.url}
                                style={{width: `${100 / calendars.length}%`}}
                                className="h-120 border-0"
                                src={calendar.url}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        className="flex items-center justify-center h-120 w-full text-(--color-darkblue)/50
                            bg-(--color-white) rounded-lg
                            shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                        Nog geen agenda's toegevoegd
                    </div>
                )}
            </div>

            <div className="flex flex-row gap-6">
                {calendars.map((calendar, i) => (
                    <SmallButton
                        key={calendar.url}
                        icon={<img className="select-none [-webkit-user-drag:none]" src={IconCalendar} />}
                        label={calendar.label}
                        active={active === i}
                        onClick={() => setActive(i)}
                    />
                ))}

                <SmallButton
                    classNameExtra="ml-auto"
                    icon={<img className="select-none [-webkit-user-drag:none]" src={IconEdit} />}
                    label="Agenda's beheren"
                    onClick={() => setIsManageShown(true)}
                />
            </div>

            {isManageShown && (
                <CalendarPopUp calendars={calendars} onClose={() => setIsManageShown(false)} onSaved={getCalendars} />
            )}
        </div>
    );
}

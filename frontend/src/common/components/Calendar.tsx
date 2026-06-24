import {useState} from "react";

import Button from "./Button";

import {IconCalendar} from "../../assets";

const calendars = [
    {
        label: "Algemeen",
        url: "https://calendar.google.com/calendar/embed?src=bnglprk6ouafmihk094plj9gu0%40group.calendar.google.com&ctz=Europe%2FAmsterdam",
    },
    {
        label: "Jantine",
        url: "https://calendar.google.com/calendar/embed?src=bitsenbytesjantine%40gmail.com&ctz=UTC",
    },
];

export default function Calendar() {
    const [active, setActive] = useState(0);

    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-hidden">
                <div
                    className={`flex w-[200%] transition-transform duration-400 ease-in-out
                        ${active === 0 ? "translate-x-0" : "-translate-x-1/2"}`}>
                    {calendars.map(calendar => (
                        <iframe key={calendar.label} className="h-100 w-1/2 border-0" src={calendar.url} />
                    ))}
                </div>
            </div>

            <div className="flex flex-row gap-6">
                {calendars.map((calendar, i) => (
                    <Button
                        key={calendar.label}
                        icon={<img className="select-none [-webkit-user-drag:none]" src={IconCalendar} />}
                        label={calendar.label}
                        active={active === i}
                        onClick={() => setActive(i)}
                    />
                ))}
            </div>
        </div>
    );
}

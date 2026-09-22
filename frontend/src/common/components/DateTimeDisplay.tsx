import {useEffect, useState} from "react";

export default function DateTimeDisplay({muted = false}: {muted?: boolean}) {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formattedDate =
        date
            .toLocaleDateString("nl-NL", {
                weekday: "long",
                day: "numeric",
                month: "long",
            })
            .charAt(0)
            .toUpperCase() +
        date
            .toLocaleDateString("nl-NL", {
                weekday: "long",
                day: "numeric",
                month: "long",
            })
            .slice(1);

    const formattedTime = date.toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div
            className={`container_dates font-black ${muted ? "text-(--color-orange)/50" : "text-(--color-orange)/70"}`}>
            <div>{formattedDate}</div>

            <div>{formattedTime}</div>
        </div>
    );
}

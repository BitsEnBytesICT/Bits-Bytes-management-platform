import React, {useEffect, useState} from "react";

export default function DateTimeDisplay() {
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
        <div className="container_dates">
            <div className="font-black text-(--color-orange)/70">{formattedDate}</div>
            <div className="font-black text-(--color-orange)/70">{formattedTime}</div>
        </div>
    );
}

import {useEffect, useState} from "react";
import ParticipantDashboardService from "./ParticipantDashboard.service";
import {useNavigate} from "react-router-dom";

export default function DeelnemerDashboard() {
    const [date, setDate] = useState(new Date());

    const service: ParticipantDashboardService = new ParticipantDashboardService();

    const navigate = useNavigate();

    useEffect(() => {
        service.isVerified().then(status => {
            if (status !== 200) navigate("/login");
        });

        const timer = setInterval(() => {
            setDate(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formattedDate = date.toLocaleDateString("nl-NL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <>
            <div className="container_top">
                <div className="container_titles">
                    <div className="text-(--color-darkblue)">Deelnemer Dashboard</div>

                    <div className="container_dates">
                        <div className="date">{formattedDate}</div>

                        <div className="time">{formattedTime}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

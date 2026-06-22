import {useState} from "react";

import DateTimeDisplay from "../../common/components/DateTimeDisplay";
import Card from "../../common/components/Card";

import DeelnemerTable from "../../common/components/DeelnemerTable";

import Button from "../../common/components/Button";

import {IconAddUser, IconExport, IconLink} from "../../assets";

const calendarUrl =
    "https://calendar.google.com/calendar/embed?src=bnglprk6ouafmihk094plj9gu0%40group.calendar.google.com&ctz=Europe%2FAmsterdam";

export default function ZorgDashboard() {
    const [current, setCurrent] = useState(0);

    function navigate() {
        setCurrent(prev => (prev === 0 ? 1 : 0));
    }

    return (
        <>
            <div className="flex flex-col gap-25">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-[1.5rem]">
                        <div className="text-[22px] font-semibold text-(--color-darkblue)">Dashboard</div>
                        <DateTimeDisplay />
                    </div>

                    <div className="flex flex-row gap-[4rem]">
                        <Card title="Deelnemers aanwezig:" value={17} />
                        <Card title="Deelnemers totaal:" value={40} />
                    </div>
                </div>

                <div className="">
                    <Button onClick={navigate} label="Navigeer" icon={<img src={IconLink} />} />
                </div>

                <div className="">
                    <DeelnemerTable tableColumns={["firstname", "lastname", "organisation", "product", "active"]} />
                </div>

                <div className="mt-4 min-w-full overflow-hidden">
                    <div
                        className={`flex transition-transform duration-400 ease-in-out ${current === 0 ? "translate-x-0" : "-translate-x-1/2"}`}
                        style={{width: "200%"}}>
                        <iframe className="h-100" style={{border: 0, width: "50%"}} src={calendarUrl} />
                        <iframe className="h-100" style={{border: 0, width: "50%"}} src={calendarUrl} />
                    </div>
                </div>

                <div>
                    <button onClick={navigate} className="text-[22px]">
                        left
                    </button>
                    <button onClick={navigate} className="text-[22px]">
                        right
                    </button>
                </div>
            </div>
        </>
    );
}

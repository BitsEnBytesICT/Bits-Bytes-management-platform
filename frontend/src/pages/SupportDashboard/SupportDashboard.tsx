import {useEffect, useState} from "react";

import DateTimeDisplay from "../../common/components/DateTimeDisplay";
import Card from "../../common/components/Card";
import Table from "../../common/components/Table";
import FloorPlans from "../../common/components/FloorPlans";
import Calendar from "../../common/components/Calendar";
import SmallButton from "../../common/components/SmallButton";

import SupportDashboardService from "./SupportDashboard.service";

import type IParticipant from "../../types/compontents/IParticipant";
import type {ITableColumn} from "../../types/compontents/ITable";

import {IconAddUser, IconExport, IconLink} from "../../assets";

const participantColumns: ITableColumn<IParticipant>[] = [
    {key: "firstname", label: "Naam"},
    {key: "lastname", label: "Achternaam"},
    {key: "organisation", label: "Organisatie"},
    {
        key: "clockedin",
        label: "Aanwezig",
        render: row => {
            const isPresent = row.clockedin === 1;
            const presenceColor = isPresent ? "text-(--color-green)" : "text-(--color-red)";

            return <div className={`font-semibold ${presenceColor}`}>{isPresent ? "Aanwezig" : "Afwezig"}</div>;
        },
    },
];

export default function SupportDashboard() {
    const [totalParticipants, setTotalParticipants] = useState(0);
    const [presentParticipants, setPresentParticipants] = useState(0);
    const [participants, setParticipants] = useState<IParticipant[]>([]);

    useEffect(() => {
        const service = new SupportDashboardService();

        const getData = async () => {
            await service.getTotalParticipants().then(setTotalParticipants);
            await service.getPresentParticipants().then(setPresentParticipants);
            await service.getParticipants().then(setParticipants);
        };

        getData();
    }, []);

    return (
        <>
            <div className="flex flex-col gap-25">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-6">
                        <div className="text-[22px] font-semibold text-(--color-darkblue)">Dashboard</div>

                        <DateTimeDisplay />
                    </div>

                    <div className="flex flex-row gap-8 min-[1000px]:gap-16">
                        <Card title="Deelnemers aanwezig:" value={presentParticipants} />

                        <Card title="Deelnemers totaal:" value={totalParticipants} />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row gap-6">
                            <SmallButton
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconLink} />}
                                label="Cliendo"
                                onClick={() => window.open("https://www.google.nl", "_blank")}
                            />

                            <SmallButton
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconLink} />}
                                label="ZilliZ"
                                onClick={() => window.open("https://www.google.nl", "_blank")}
                            />
                        </div>

                        <div className="flex flex-row gap-6">
                            <SmallButton
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconAddUser} />}
                                label="Deelnemer toevoegen"
                                onClick={() => console.log("Deelnemer toevoegen")}
                            />

                            <SmallButton
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconExport} />}
                                label="Exporteer"
                                onClick={() => console.log("Exporteer")}
                            />
                        </div>
                    </div>

                    <Table columns={participantColumns} rows={participants} rowKey="id" />
                </div>

                <FloorPlans />

                <Calendar />
            </div>
        </>
    );
}

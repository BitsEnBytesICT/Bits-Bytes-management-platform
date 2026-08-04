import {useEffect, useState} from "react";

import DateTimeDisplay from "../../common/components/DateTimeDisplay";
import Card from "../../common/components/Card";
import FloorPlans from "../../common/components/FloorPlans";
import Calendar from "../../common/components/Calendar";
import SmallButton from "../../common/components/SmallButton";

import SupportDashboardTable from "./components/SupportDashboardTable";

import ParticipantPopUp from "../Participants/components/ParticipantPopUp";

import SupportDashboardService from "./SupportDashboard.service";

import type IParticipant from "../../types/compontents/IParticipant";

import {IconAddUser, IconLink, IconExport} from "../../assets";

import buildPDF from "../../common/buildPDF";

export default function SupportDashboard() {
    const [totalParticipants, setTotalParticipants] = useState(0);
    const [presentParticipants, setPresentParticipants] = useState(0);
    const [participants, setParticipants] = useState<IParticipant[]>([]);
    const [isAddParticipantShown, setIsAddParticipantShown] = useState(false);

    useEffect(() => {
        const service = new SupportDashboardService();

        const getData = async () => {
            await service.getTotalParticipants().then(setTotalParticipants);
            await service.getPresentParticipants().then(setPresentParticipants);
            await service.getParticipants().then(setParticipants);
        };

        Promise.all([getData()]);
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
                                onClick={() => setIsAddParticipantShown(true)}
                            />

                            <SmallButton
                                label="Exporteer"
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconExport} />}
                                active={false}
                                onClick={() => buildPDF(participants)}
                            />
                        </div>
                    </div>

                    <div>
                        <SupportDashboardTable participants={participants} />
                    </div>
                </div>

                <FloorPlans />

                <Calendar />
            </div>

            {isAddParticipantShown && (
                <ParticipantPopUp
                    mode="add"
                    setParticipants={setParticipants}
                    onClose={() => setIsAddParticipantShown(false)}
                />
            )}
        </>
    );
}

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

import {IconAddUser, IconLink} from "../../assets";

import {Document, Page, Text, View} from "@react-pdf/renderer";
import PDFDownload from "../../common/components/PDFDownload";

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

        getData();
    }, []);

    const PDF = () => (
        <Document>
            <Page size="A4" style={{padding: 24}}>
                {participants.map((p, i) => (
                    <View key={i} style={{flexDirection: "row", marginBottom: 4}}>
                        <Text>{String(p.firstname ?? "")}</Text>
                        <Text>{String(p.lastname ?? "")}</Text>
                    </View>
                ))}
            </Page>
        </Document>
    );

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

                            <PDFDownload
                                document={<PDF />}
                                filename={"participant-export.pdf"}
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconAddUser} />}
                                active={false}></PDFDownload>
                        </div>
                    </div>

                    <div>
                        <SupportDashboardTable participants={participants} />
                    </div>
                </div>

                <FloorPlans />

                <Calendar />
            </div>

            {isAddParticipantShown && <ParticipantPopUp mode="add" onClose={() => setIsAddParticipantShown(false)} />}
        </>
    );
}

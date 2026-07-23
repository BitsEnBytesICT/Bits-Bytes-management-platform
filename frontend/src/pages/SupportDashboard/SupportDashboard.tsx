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

import {Document, Page, StyleSheet, Text, View} from "@react-pdf/renderer";
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

    const styles = StyleSheet.create({
        page: {
            padding: 30,
            backgroundColor: "#FFFFFF",
        },
        gridContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            marginHorizontal: -10,
        },
        gridItem: {
            width: "33.33%",
            paddingHorizontal: 10,
            marginBottom: 20,
        },
        card: {
            border: "1px solid #e2e8f0",
            borderRadius: 4,
            padding: 12,
            backgroundColor: "#f8fafc",
            minHeight: 100,
        },
        title: {
            fontSize: 12,
            fontWeight: "bold",
        },
    });

    const PDF = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.gridContainer}>
                    {participants.map((participant, index) => (
                        <View key={index} style={styles.gridItem}>
                            <View style={styles.card}>
                                <Text style={styles.title}>
                                    {participant.firstname} {participant.lastname}
                                </Text>
                                <Text style={{fontSize: 10}}>Organisatie: {participant.organisation}</Text>
                                <Text style={{fontSize: 10}}>RFID: {participant.rfid}</Text>
                                <Text style={{fontSize: 10}}>Financiering: {participant.financing}</Text>
                            </View>
                        </View>
                    ))}
                </View>
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
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconExport} />}
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

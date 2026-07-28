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

import {IconAddUser, IconLink, IconExport, LogoDefaultPng} from "../../assets";

import {Document, Page, StyleSheet, Text, View, Image} from "@react-pdf/renderer";
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

    const printDate = new Date();
    const formattedDate = `${printDate.getDate()}-${printDate.getMonth() + 1}-${printDate.getFullYear()}`;

    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;
    const PADDING_X = 30;
    const PADDING_TOP = 100;
    const PADDING_BOTTOM = 40;
    const CELL_HEIGHT = (PAGE_HEIGHT - PADDING_TOP - PADDING_BOTTOM) / 2;

    const styles = StyleSheet.create({
        page: {
            paddingHorizontal: PADDING_X,
            paddingTop: PADDING_TOP,
            paddingBottom: PADDING_BOTTOM,
            fontSize: 9,
            color: "#1e293b",
            backgroundColor: "#FFFFFF",
        },
        header: {
            position: "absolute",
            top: 24,
            left: PADDING_X,
            right: PADDING_X,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 6,
            borderBottom: "1px solid #1e293b",
        },
        headerLeft: {
            flexDirection: "row",
        },
        headerLabel: {
            fontWeight: "bold",
        },
        headerDate: {
            marginLeft: 4,
        },
        logo: {
            width: 150,
            height: 40,
            objectFit: "contain",
        },
        grid: {
            flexDirection: "row",
            flexWrap: "wrap",
        },
        cell: {
            width: "50%",
            height: CELL_HEIGHT,
            padding: 14,
        },
        columnDivider: {
            position: "absolute",
            top: PADDING_TOP,
            bottom: PADDING_BOTTOM,
            left: PAGE_WIDTH / 2,
            borderLeft: "1px solid #1e293b",
        },
        rowDivider: {
            position: "absolute",
            top: PADDING_TOP + CELL_HEIGHT,
            left: PADDING_X,
            right: PADDING_X,
            borderTop: "1px solid #1e293b",
        },
        footer: {
            position: "absolute",
            bottom: 18,
            right: PADDING_X,
        },
        name: {
            fontWeight: "bold",
            marginBottom: 12,
        },
        row: {
            flexDirection: "row",
            marginBottom: 6,
        },
        rowLabel: {
            width: 80,
        },
    });

    const Field = ({label, value}: {label: string; value?: string | number}) => (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text>{value}</Text>
        </View>
    );

    const ENTRIES_PER_PAGE = 4;

    const pages = Array.from({length: Math.max(1, Math.ceil(participants.length / ENTRIES_PER_PAGE))}, (_, page) =>
        participants.slice(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE),
    );

    const PDF = () => (
        <Document>
            {pages.map((pageParticipants, pageIndex) => (
                <Page key={pageIndex} size="A4" style={styles.page}>
                    <View style={styles.header} fixed>
                        <View style={styles.headerLeft}>
                            <Text style={styles.headerLabel}>Print Datum:</Text>
                            <Text style={styles.headerDate}>{formattedDate}</Text>
                        </View>

                        <Image style={styles.logo} src={LogoDefaultPng} />
                    </View>

                    <View style={styles.columnDivider} fixed />
                    <View style={styles.rowDivider} fixed />

                    <View style={styles.grid}>
                        {pageParticipants.map((participant, index) => (
                            <View key={index} style={styles.cell}>
                                <Text style={styles.name}>
                                    {participant.firstname} {participant.lastname}
                                </Text>
                                <Field label="Organisatie:" value={participant.organisation} />
                                <Field label="RFID Tag:" value={participant.rfid} />
                                <Field label="Actief:" value={participant.active ? "Actief" : "InActief"} />
                                <Field label="Financiering:" value={participant.financing} />
                            </View>
                        ))}
                    </View>

                    <Text
                        style={styles.footer}
                        fixed
                        render={({pageNumber, totalPages}) => `Pagina ${pageNumber} van de ${totalPages}`}
                    />
                </Page>
            ))}
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

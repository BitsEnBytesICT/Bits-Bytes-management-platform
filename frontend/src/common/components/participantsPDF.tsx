import {Document, Page, StyleSheet, Text, View, Image} from "@react-pdf/renderer";
import {LogoDefaultPng} from "../../assets";
import {pdf} from "@react-pdf/renderer";
import type IParticipant from "../../types/compontents/IParticipant";

export const buildPDF = async (data: IParticipant[]) => {
    const blob = await pdf(<ParticipantsPDF data={data}></ParticipantsPDF>).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "participants-export.pdf";
    document.body.append(link);
    link.click();
};

export default function ParticipantsPDF({data}) {
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

    const pages = Array.from({length: Math.max(1, Math.ceil(data.length / ENTRIES_PER_PAGE))}, (_, page) =>
        data.slice(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE),
    );

    return (
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
}

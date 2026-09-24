import {Document, Image, Page, Path, StyleSheet, Svg, Text, View} from "@react-pdf/renderer";

import type IAttendance from "../../../types/compontents/IAttendance";
import type IParticipant from "../../../types/compontents/IParticipant";

import {LogoDefaultPng} from "../../../assets";
import {formatDate} from "../../../common/helperFunctions";

interface ISignaturesPDF {
    signatures: IAttendance[];
    participants: IParticipant[];
}

interface IParsedSignature {
    width: number;
    height: number;
    paths: string[];
}

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const PADDING_X = 30;
const PADDING_TOP = 100;
const PADDING_BOTTOM = 40;
const CELL_PADDING = 14;
const CELL_WIDTH = (PAGE_WIDTH - PADDING_X * 2) / 2;
const CELL_HEIGHT = (PAGE_HEIGHT - PADDING_TOP - PADDING_BOTTOM) / 2;

const SIGNATURE_BOX_PADDING = 6;
const SIGNATURE_BOX_HEIGHT = 150;
const SIGNATURE_MAX_WIDTH = CELL_WIDTH - CELL_PADDING * 2 - SIGNATURE_BOX_PADDING * 2;
const SIGNATURE_MAX_HEIGHT = SIGNATURE_BOX_HEIGHT - SIGNATURE_BOX_PADDING * 2;

const ENTRIES_PER_PAGE = 4;

function parseSignature(svg: string): IParsedSignature | null {
    const root = new DOMParser().parseFromString(svg, "image/svg+xml").querySelector("svg");
    if (!root) return null;

    const width = Number(root.getAttribute("width"));
    const height = Number(root.getAttribute("height"));
    const paths = Array.from(root.querySelectorAll("path"), path => path.getAttribute("d")).filter(Boolean);

    return width && height && paths.length ? {width, height, paths} : null;
}

export default function SignaturesPDF({signatures, participants}: ISignaturesPDF) {
    const printDate = new Date();
    const formattedDate = `${printDate.getDate()}-${printDate.getMonth() + 1}-${printDate.getFullYear()}`;

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
            padding: CELL_PADDING,
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
        signatureLabel: {
            marginTop: 6,
            marginBottom: 6,
        },
        signatureBox: {
            height: SIGNATURE_BOX_HEIGHT,
            padding: SIGNATURE_BOX_PADDING,
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #cbd5e1",
            borderRadius: 4,
        },
        noSignature: {
            color: "#94a3b8",
        },
    });

    const Field = ({label, value}: {label: string; value?: string | number}) => (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text>{value}</Text>
        </View>
    );

    const Signature = ({svg}: {svg: string}) => {
        const parsed = parseSignature(svg);
        if (!parsed) return <Text style={styles.noSignature}>Geen handtekening</Text>;

        const scale = Math.min(SIGNATURE_MAX_WIDTH / parsed.width, SIGNATURE_MAX_HEIGHT / parsed.height);

        return (
            <Svg
                width={parsed.width * scale}
                height={parsed.height * scale}
                viewBox={`0 0 ${parsed.width} ${parsed.height}`}>
                {parsed.paths.map((d, index) => (
                    <Path
                        key={index}
                        d={d}
                        fill="none"
                        stroke="#000000"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ))}
            </Svg>
        );
    };

    const pages = Array.from({length: Math.max(1, Math.ceil(signatures.length / ENTRIES_PER_PAGE))}, (_, page) =>
        signatures.slice(page * ENTRIES_PER_PAGE, (page + 1) * ENTRIES_PER_PAGE),
    );

    return (
        <Document>
            {pages.map((pageSignatures, pageIndex) => (
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
                        {pageSignatures.map((signature, index) => {
                            const participant = participants.find(p => p.id === signature.participantID);

                            return (
                                <View key={signature.id ?? index} style={styles.cell}>
                                    <Text style={styles.name}>
                                        {participant
                                            ? `${participant.firstname} ${participant.lastname}`
                                            : `Deelnemer ${signature.participantID}`}
                                    </Text>
                                    <Field label="Organisatie:" value={participant?.organisation ?? "-"} />
                                    <Field label="Ingeklokt:" value={formatDate(signature.clockinDate)} />
                                    <Field label="Uitgeklokt:" value={formatDate(signature.clockoutDate)} />
                                    <Field
                                        label="Werkduur:"
                                        value={signature.workDuration != null ? `${signature.workDuration} min` : "-"}
                                    />

                                    <Text style={styles.signatureLabel}>Handtekening:</Text>
                                    <View style={styles.signatureBox}>
                                        <Signature svg={signature.signature} />
                                    </View>
                                </View>
                            );
                        })}
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

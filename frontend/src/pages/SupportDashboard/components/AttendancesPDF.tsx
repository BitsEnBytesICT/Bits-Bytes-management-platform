import {Document, Page, StyleSheet, Text, View} from "@react-pdf/renderer";

import type {IParticipant} from "../../../types/compontents/IParticipant";

interface IAttendanceExportPDF {
    morningParticipants: IParticipant[];
    afternoonParticipants: IParticipant[];
    fullDayParticipants: IParticipant[];
}

const ROW_HEIGHT = 13.56;
const WORKDAYS = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"];

const styles = StyleSheet.create({
    page: {
        paddingTop: 72,
        paddingBottom: 40,
        paddingHorizontal: 70.8,
        fontFamily: "Helvetica",
        fontSize: 11,
        color: "#000000",
        backgroundColor: "#FFFFFF",
    },
    day: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 11,
    },
    section: {
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: "#000000",
    },
    heading: {
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: "#000000",
        fontWeight: "bold",
        textAlign: "center",
        height: 13.92,
        lineHeight: "13.42pt",
    },
    adjoiningSection: {
        marginTop: -0.5,
    },
    participants: {
        paddingLeft: 59.3,
        paddingRight: 12,
        paddingTop: 2,
    },
    participant: {
        flexDirection: "row",
        minHeight: ROW_HEIGHT,
    },
    bullet: {
        width: 18,
        lineHeight: `${ROW_HEIGHT}pt`,
    },
    name: {
        flex: 1,
        lineHeight: `${ROW_HEIGHT}pt`,
    },
});

export default function AttendanceExportPDF({
    morningParticipants,
    afternoonParticipants,
    fullDayParticipants = [],
}: IAttendanceExportPDF) {
    const day = WORKDAYS[new Date().getDay() - 1] ?? "Maandag";
    const sections = [
        {title: "Ochtend", participants: morningParticipants, minimumRows: 5},
        {title: "Middag", participants: afternoonParticipants, minimumRows: 4},
        {title: "Hele dag", participants: fullDayParticipants, minimumRows: 18},
    ];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.day} fixed>
                    {day}
                </Text>

                {sections.map(({title, participants, minimumRows}, sectionIndex) => (
                    <View key={title} style={sectionIndex ? [styles.section, styles.adjoiningSection] : styles.section}>
                        <Text style={styles.heading} minPresenceAhead={ROW_HEIGHT * 2}>
                            {title}
                        </Text>
                        <View style={[styles.participants, {minHeight: minimumRows * ROW_HEIGHT}]}>
                            {participants.map((participant, index) => (
                                <View key={participant.id ?? index} style={styles.participant} wrap={false}>
                                    <Text style={styles.bullet}>-</Text>
                                    <Text style={styles.name}>
                                        {[participant.firstname, participant.prefix, participant.lastname]
                                            .filter(Boolean)
                                            .join(" ")}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </Page>
        </Document>
    );
}

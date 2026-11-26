import {Document, Page, Path, StyleSheet, Svg, Text, View} from "@react-pdf/renderer";

import type {IParticipant} from "../../../types/compontents/IParticipant";

interface IAttendanceExportPDF {
    morningParticipants: IParticipant[];
    afternoonParticipants: IParticipant[];
    fullDayParticipants: IParticipant[];
}

const ROW_HEIGHT = 13.56;
const COMMENT_COLOR = "#FF5E5E";
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
        lineHeight: `${ROW_HEIGHT}pt`,
    },
    commentArrow: {
        width: 10,
        height: ROW_HEIGHT,
        marginHorizontal: 3,
        flexShrink: 0,
    },
    comment: {
        flex: 1,
        lineHeight: `${ROW_HEIGHT}pt`,
        color: COMMENT_COLOR,
    },
});

export default function AttendanceExportPDF({
    morningParticipants,
    afternoonParticipants,
    fullDayParticipants = [],
}: IAttendanceExportPDF) {
    const day = WORKDAYS[new Date().getDay() - 1] ?? "Maandag";
    const sections = [
        {
            title: "Ochtend",
            participants: morningParticipants.sort((a, b) =>
                a.firstname.localeCompare(b.firstname, "nl", {sensitivity: "base"}),
            ),
            minimumRows: 5,
        },
        {
            title: "Middag",
            participants: afternoonParticipants.sort((a, b) =>
                a.firstname.localeCompare(b.firstname, "nl", {sensitivity: "base"}),
            ),
            minimumRows: 4,
        },
        {
            title: "Hele dag",
            participants: fullDayParticipants.sort((a, b) =>
                a.firstname.localeCompare(b.firstname, "nl", {sensitivity: "base"}),
            ),
            minimumRows: 18,
        },
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
                                    {participant.shortComments && (
                                        <>
                                            <Svg style={styles.commentArrow} viewBox="0 0 10 14">
                                                <Path
                                                    d="M1 7 H9 M6 4 L9 7 L6 10"
                                                    fill="none"
                                                    stroke={COMMENT_COLOR}
                                                    strokeWidth={1.1}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </Svg>
                                            <Text style={styles.comment}>{participant.shortComments}</Text>
                                        </>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
                <Text>{morningParticipants.length + afternoonParticipants.length + fullDayParticipants.length}</Text>
            </Page>
        </Document>
    );
}

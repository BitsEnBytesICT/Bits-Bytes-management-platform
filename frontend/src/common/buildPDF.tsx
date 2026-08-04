import {pdf} from "@react-pdf/renderer";

import ParticipantsPDF from "./components/participantsPDF";

import type IParticipant from "../types/compontents/IParticipant";

export default async function buildPDF(data: IParticipant[]) {
    const blob = await pdf(<ParticipantsPDF data={data} />).toBlob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "participants-export.pdf";

    document.body.append(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

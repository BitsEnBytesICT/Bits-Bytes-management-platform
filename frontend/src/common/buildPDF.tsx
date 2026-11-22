import {pdf} from "@react-pdf/renderer";

export async function downloadPDF(document: Parameters<typeof pdf>[0], fileName: string) {
    const blob = await pdf(document).toBlob();
    const url = URL.createObjectURL(blob);

    const link = window.document.createElement("a");
    link.href = url;
    link.download = fileName;

    window.document.body.append(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

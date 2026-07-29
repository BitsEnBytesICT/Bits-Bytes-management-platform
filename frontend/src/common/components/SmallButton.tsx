import {PDFDownloadLink} from "@react-pdf/renderer";
import type ISmallButton from "../../types/compontents/ISmallButton";
import {ButtonType} from "../../types/compontents/ISmallButton";

export default function SmallButton({
    icon,
    label,
    active,
    type,
    document: pdfDocument,
    filename,
    onClick,
}: ISmallButton) {
    const className = `px-3 py-2 flex flex-row gap-2.5
        ${active ? "bg-(--color-darkblue)/5" : "bg-(--color-white)"} appearance-none rounded-lg
        shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)] cursor-pointer
        transition-colors duration-300 ease-in-out hover:bg-(--color-darkblue)/10`;

    if (type === ButtonType.DOWNLOAD) {
        if (!pdfDocument) return null;

        return (
            <PDFDownloadLink document={pdfDocument} fileName={filename} className={className}>
                {({loading, error}) => (
                    <>
                        {icon}
                        <div className="text-sm font-semibold text-(--color-darkblue)">
                            {error ? "Fout" : loading ? "Bezig…" : "Exporteer"}
                        </div>
                    </>
                )}
            </PDFDownloadLink>
        );
    }

    return (
        <button onClick={onClick} className={className}>
            {icon}
            <div className="text-sm font-semibold text-(--color-darkblue)">{label}</div>
        </button>
    );
}

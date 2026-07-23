import {PDFDownloadLink} from "@react-pdf/renderer";

export default function PDFDownload({icon, active, document, filename}) {
    return (
        <PDFDownloadLink
            document={document}
            fileName={filename}
            className={`px-3 py-2 flex flex-row gap-2.5 ${active ? "bg-(--color-darkblue)/5" : "bg-(--color-white)"}
                appearance-none rounded-lg shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]
                cursor-pointer transition-colors duration-300 ease-in-out hover:bg-(--color-darkblue)/10`}>
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

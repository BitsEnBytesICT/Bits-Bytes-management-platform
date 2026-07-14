import type IParticipant from "../../types/compontents/IParticipant";
import type IParticipantsTable from "../../types/compontents/IParticipantsTable";

const columnLabels: Record<keyof IParticipant, string> = {
    id: "ID",
    firstname: "Naam",
    lastname: "Achternaam",
    organisation: "Organisatie",
    account: "Account",
    rfid: "RFID",
    createdAt: "Aangemaakt",
    active: "Status",
    clockedin: "Ingeklokt",
    product: "Plaats",
};

export default function DeelnemerTable({tableColumns, participants}: IParticipantsTable) {
    function renderColumn(column: keyof IParticipant, row: IParticipant): React.ReactNode {
        if (column === "active") {
            const present = row.clockedin === 1;
            return (
                <div className={present ? "font-semibold text-(--color-green)" : "font-semibold text-(--color-red)"}>
                    {present ? "Aanwezig" : "Afwezig"}
                </div>
            );
        }

        return <div>{String(row[column])}</div>;
    }

    function renderRow(row: IParticipant) {
        return (
            <div key={row.id} className="flex flex-row">
                {tableColumns.map(col => (
                    <div key={col} className="px-4 py-4 flex-1 text-sm font-semibold">
                        {renderColumn(col, row)}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="pr-3 w-full">
            <div className="flex flex-row text-(--color-darkblue)/50 rounded-lg bg-(--color-darkblue)/2">
                {tableColumns.map(col => (
                    <div key={col} className="px-4 py-3 flex-1 text-sm font-medium">
                        {columnLabels[col]}
                    </div>
                ))}
            </div>

            <div
                className="-mr-[0.30rem] overflow-y-scroll max-h-64 [&::-webkit-scrollbar]:w-[0.30rem]
                    [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-(--color-black)/10
                    [&::-webkit-scrollbar-track]:bg-transparent">
                {participants.map(row => renderRow(row))}
            </div>
        </div>
    );
}

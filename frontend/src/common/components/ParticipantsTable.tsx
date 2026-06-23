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

const tempData: IParticipant[] = [
    {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        organisation: "WMO",
        account: 1,
        rfid: "",
        createdAt: "",
        active: 1,
        clockedin: 1,
        product: "C3",
    },
    {
        id: 2,
        firstname: "Mister",
        lastname: "I don't know",
        organisation: "Zeeland Zorg",
        account: 2,
        rfid: "",
        createdAt: "",
        active: 0,
        clockedin: 0,
        product: "F5",
    },
    {
        id: 3,
        firstname: "Misses",
        lastname: "I don't know",
        organisation: "Nederland Zorg",
        account: 3,
        rfid: "",
        createdAt: "",
        active: 0,
        clockedin: 0,
        product: "A2",
    },
    {
        id: 4,
        firstname: "Antonina",
        lastname: "I don't know",
        organisation: "Bits",
        account: 4,
        rfid: "",
        createdAt: "",
        active: 1,
        clockedin: 1,
        product: "A2",
    },
    {
        id: 5,
        firstname: "John",
        lastname: "Doe",
        organisation: "WMO",
        account: 1,
        rfid: "",
        createdAt: "",
        active: 1,
        clockedin: 1,
        product: "C3",
    },
    {
        id: 6,
        firstname: "Mister",
        lastname: "I don't know",
        organisation: "Zeeland Zorg",
        account: 2,
        rfid: "",
        createdAt: "",
        active: 0,
        clockedin: 0,
        product: "F5",
    },
    {
        id: 7,
        firstname: "Misses",
        lastname: "I don't know",
        organisation: "Nederland Zorg",
        account: 3,
        rfid: "",
        createdAt: "",
        active: 0,
        clockedin: 0,
        product: "A2",
    },
    {
        id: 8,
        firstname: "Antonina",
        lastname: "I don't know",
        organisation: "Bits",
        account: 4,
        rfid: "",
        createdAt: "",
        active: 1,
        clockedin: 1,
        product: "A2",
    },
];

export default function DeelnemerTable({tableColumns}: IParticipantsTable) {
    function renderColumn(column: keyof IParticipant, row: IParticipant): React.ReactNode {
        if (column === "active") {
            const present = row.clockedin === 1;
            return (
                <span className={present ? "font-semibold text-green-400" : "font-semibold text-red-400"}>
                    {present ? "Aanwezig" : "Afwezig"}
                </span>
            );
        }

        return <span>{String(row[column])}</span>;
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
                {tempData.map(row => renderRow(row))}
            </div>
        </div>
    );
}

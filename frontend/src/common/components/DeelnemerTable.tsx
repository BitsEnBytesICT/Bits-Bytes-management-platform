import type IDeelnemer from "../../types/compontents/IDeelnemer";
import type IDeelnemerTable from "../../types/compontents/IDeelnemerTable";

const columnLabels: Record<keyof IDeelnemer, string> = {
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

const tableColumnsStyle: React.CSSProperties = {
    color: "color-mix(in srgb, var(--color-darkblue) 50%, transparent)",
    backgroundColor: "color-mix(in srgb, var(--color-darkblue) 2%, transparent)",
};

const tempData: IDeelnemer[] = [
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

export default function DeelnemerTable({tableColumns}: IDeelnemerTable) {
    function renderColumn(column: keyof IDeelnemer, row: IDeelnemer): React.ReactNode {
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

    function renderRow(row: IDeelnemer) {
        return (
            <div key={row.id} className="flex flex-row">
                {tableColumns.map(col => (
                    <div key={col} className="flex-1 px-[1rem] py-[1rem] text-sm font-semibold">
                        {renderColumn(col, row)}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-full pr-[0.75rem]">
            <div className="flex flex-row rounded-lg" style={tableColumnsStyle}>
                {tableColumns.map(col => (
                    <div key={col} className="flex-1 px-[1rem] py-[0.75rem] text-sm font-medium">
                        {columnLabels[col]}
                    </div>
                ))}
            </div>

            <div className="-mr-[0.30rem] max-h-[16rem] overflow-y-scroll [&::-webkit-scrollbar]:w-[0.30rem] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-(--color-darkblue) [&::-webkit-scrollbar-track]:bg-transparent">
                {tempData.map(row => renderRow(row))}
            </div>
        </div>
    );
}

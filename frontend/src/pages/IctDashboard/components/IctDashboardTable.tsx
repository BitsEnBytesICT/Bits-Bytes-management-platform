import Table from "../../../common/components/Table";
import type { ITableColumn } from "../../../types/compontents/ITable";

interface IServer {
    id: number;
    hostname: string;
    ipAdres: string;
    version: string
    schijfruimteGebruikt: number;
    schijfruimteTotaal: number;
    onlineStatus: number;
}

const dummyData = [
    {
        id: "1",
        hostname: "Server 1",
        ipAdres: "128.0.0.1",
        version: "windows 98",
        schijfruimteGebruikt: "22",
        schijfruimteTotaal: "100",
        onlineStatus: 1,
    },
    {
        id: "2",
        hostname: "Server 2",
        ipAdres: "128.0.0.2",
        version: "windows 95",
        schijfruimteGebruikt: "37",
        schijfruimteTotaal: "60",
        onlineStatus: 0,
    },
];

export default function IctDashboardTable({setServerOnline}: any) {
    const displayRows = dummyData as any;
    const serverColumns: ITableColumn<IServer>[] = [
        {key: "hostname", label: "Hostname"},
        {key: "ipAdres", label: "IP Adres"},
        {key: "version", label: "OS/Versie"},
        {
            key: "onlineStatus",
            label: "Status",
            render: (row: any) => {
                const isPresent = (row as any).onlineStatus === 1;
                const presenceColor = isPresent ? "text-(--color-green)" : "text-(--color-red)";

                return <div className={`font-semibold ${presenceColor}`}>{isPresent ? "Online" : "Offline"}</div>;
            },
        },
        {
            key: "schijfruimte",
            label: "schijfruimte",
            render: (row: any) => {
                return <div className="flex flex-wrap">
                    {
                        `${row.schijfruimteGebruikt} / ${row.schijfruimteTotaal} GB
                        (${Math.round((row.schijfruimteGebruikt / row.schijfruimteTotaal) * 100 )}%)`
                    }
                    </div>;
            },
        },
    ];
    return (
        <div className="max-h-120">
            <Table
                columns={serverColumns}
                rows={displayRows}
                setRows={setServerOnline}
                checkBox={false}
                rowKey="id"
            />
        </div>
    );
}

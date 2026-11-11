import Table from "../../../common/components/Table";
const dummyData = [
    {
        id: "1",
        hostname: "Server 1",
        ipAdres: "128.0.0.1",
        version: "windows 98",
        schijfruimte: "45/100 GB (45%)",
        onlineStatus: 1,
    },
    {
        id: "2",
        hostname: "Server 2",
        ipAdres: "128.0.0.2",
        version: "windows 95",
        schijfruimte: "22/100 GB (45%)",
        onlineStatus: 0,
    },
];
export default function IctDashboardTable({setServerOnline}: any) {
    const displayRows = dummyData as any;
    const participantColumns: any[] = [
        {key: "hostname", label: "Hostname"},
        {key: "ipAdres", label: "IP Adres"},
        {key: "version", label: "OS/Versie"},
        {
            key: "onlineStatus",
            label: "Status",
            render: row => {
                const isPresent = (row as any).onlineStatus === 1;
                const presenceColor = isPresent ? "text-(--color-green)" : "text-(--color-red)";

                return <div className={`font-semibold ${presenceColor}`}>{isPresent ? "Ingeklokt" : "Uitgeklokt"}</div>;
            },
        },
        {
            key: "schijfruimte",
            label: "schijfruimte",
            render: (row: any) => {
                return <div className="flex flex-wrap">{(row as any).schijfruimte}</div>;
            },
        },
    ];
    return (
        <div className="max-h-120">
            <Table
                columns={participantColumns}
                rows={displayRows}
                setRows={setServerOnline}
                checkBox={false}
                rowKey="id"
            />
        </div>
    );
}

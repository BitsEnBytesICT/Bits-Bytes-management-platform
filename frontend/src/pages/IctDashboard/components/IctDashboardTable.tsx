import Table from "../../../common/components/Table";
import type {IParticipantWithSchedules} from "../../../types/compontents/IParticipant";

import type {ITableColumn} from "../../../types/compontents/ITable";

const dummyData = [
    {
        id: "1",
        hostname: "Server 1",
        ipAdres: "128.0.0.1",
        version: "windows 98",
        schijfruimte: "45/100 GB (45%)",
        onlineStatus: 1
    },
    {
        id: "2",
        hostname: "Server 2",
        ipAdres: "128.0.0.2",
        version: "windows 95",
        schijfruimte: "22/100 GB (45%)",
        onlineStatus: 0
    }
];

export default function IctDashboardTable({setServerOnline}: any) {
    const displayRows = dummyData as any;
    const participantColumns: ITableColumn<IParticipantWithSchedules> = [
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
            render: row => {
                return <div className="flex flex-wrap">{(row as any).schijfruimte}</div>
            },
            // render: row => {
            //     const weekday = new Date().getDay() - 1;
            //     const day = weekday < 0 || weekday > 4 ? 0 : weekday;
            //     const morningField = scheduleFieldsByDay[day * 2][0];
            //     const afternoonField = scheduleFieldsByDay[day * 2 + 1][0];
            //     const now = Date.now();

            //     const workplaceIds = new Set(
            //         row.schedules
            //             .filter(s => !s.endDate || s.endDate.getTime() > now)
            //             .flatMap(s => [s[morningField], s[afternoonField]])
            //             .filter(id => id != null),
            //     );

            //     return (
            //         <div className="flex flex-wrap">
            //             {workplaces
            //                 .filter(wp => workplaceIds.has(wp.id))
            //                 .map(wp => wp.name)
            //                 .join(", ")}
            //         </div>
            //     );
            // },
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

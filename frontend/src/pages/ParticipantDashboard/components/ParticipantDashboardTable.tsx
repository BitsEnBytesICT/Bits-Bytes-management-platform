import {useState} from "react";
import Table from "../../../common/components/Table";
import type {ITableColumn} from "../../../types/compontents/ITable";
import type IVirtualMachine from "../../../types/participantDashboard/IVirtualMachine";
import ParticipantDashboardService from "../ParticipantDashboard.service";

const columns: ITableColumn<IVirtualMachine>[] = [
    {key: "hostname", label: "Hostname", sortable: false, copyable: false},
    {key: "ipAddress", label: "IP Adres", sortable: false, copyable: false},
    {key: "operatingSystem", label: "OS/versie", sortable: false, copyable: false},
    {
        key: "status",
        label: "Status",
        sortable: false,
        copyable: false,
        render: row => (
            <span className={row.status === "online" ? "text-(--color-green)" : "text-(--color-red)"}>
                {row.status === "online" ? "Online" : "Offline"}
            </span>
        ),
    },
    {
        key: "usedStorage",
        label: "Schijfruimte",
        sortable: false,
        copyable: false,
        render: row =>
            `${row.usedStorage} / ${row.totalStorage} GB (${Math.round((row.usedStorage / row.totalStorage) * 100)}%)`,
    },
];

const service = new ParticipantDashboardService();

export default function ParticipantDashboardTable() {
    const [virtualMachines, setVirtualMachines] = useState(service.getDemoVirtualMachines);

    return (
        <div
            className="mt-5.75 h-53.5 [&_table]:min-w-180 [&_table]:leading-4.5 [&_thead_tr]:bg-(--color-darkblue)/2
                [&_th]:w-[20.833333%] [&_th]:px-6.25 [&_th]:py-3.5 [&_th:first-child]:rounded-l-[7.5px]
                [&_th:last-child]:w-[16.666667%] [&_th:last-child]:rounded-r-[7.5px] [&_td]:px-6.25 [&_td]:pt-5.25
                [&_td]:pb-1 [&_td]:whitespace-nowrap [&_tbody_tr:last-child_td]:pb-0">
            <Table columns={columns} rows={virtualMachines} setRows={setVirtualMachines} checkBox={false} rowKey="id" />
        </div>
    );
}

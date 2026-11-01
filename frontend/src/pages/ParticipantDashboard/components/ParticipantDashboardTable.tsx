import Table from "../../../common/components/Table";

import type {ITableColumn} from "../../../types/compontents/ITable";
import type IVirtualMachine from "../../../types/virtualMachines/IVirtualMachine";

interface IParticipantDashboardTable {
    virtualMachines: IVirtualMachine[];
    setVirtualMachines: (value: IVirtualMachine[]) => void;
}

export default function ParticipantDashboardTable({virtualMachines, setVirtualMachines}: IParticipantDashboardTable) {
    const columns: ITableColumn<IVirtualMachine>[] = [
        {key: "hostname", label: "Hostname"},
        {key: "ipAddress", label: "IP Adres"},
        {key: "operatingSystem", label: "OS/versie"},
        {
            key: "online",
            label: "Status",
            render: row => (
                <span className={row.online ? "text-(--color-green)" : "text-(--color-red)"}>
                    {row.online ? "Online" : "Offline"}
                </span>
            ),
        },
        {
            key: "storageUsed",
            label: "Schijfruimte",
            render: row =>
                `${row.storageUsed} / ${row.storageTotal} GB (${Math.round((row.storageUsed / row.storageTotal) * 100)}%)`,
        },
    ];

    return (
        <div className="overflow-x-auto">
            <div className="min-w-225 max-h-64">
                <Table
                    columns={columns}
                    rows={virtualMachines}
                    setRows={setVirtualMachines}
                    checkBox={false}
                    rowKey="id"
                />
            </div>
        </div>
    );
}

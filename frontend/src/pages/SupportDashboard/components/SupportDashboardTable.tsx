import Table from "../../../common/components/Table";
import type {IParticipantWithSchedules} from "../../../types/compontents/IParticipant";

import type {ITableColumn} from "../../../types/compontents/ITable";
import type {IWorkplace} from "../../../types/floorPlans/IWorkplace";
import {scheduleFieldsByDay} from "../../../types/schedules/ISchedule";

interface ISupportDashboardTable {
    participants: IParticipantWithSchedules[];
    setParticipants: (value: IParticipantWithSchedules[]) => void;
    workplaces: IWorkplace[];
}

export default function SupportDashboardTable({participants, setParticipants, workplaces}: ISupportDashboardTable) {
    const participantColumns: ITableColumn<IParticipantWithSchedules>[] = [
        {key: "firstname", label: "Naam"},
        {key: "lastname", label: "Achternaam"},
        {
            key: "clockedin",
            label: "Ingeklokt",
            render: row => {
                const isPresent = row.clockedin === 1;
                const presenceColor = isPresent ? "text-(--color-green)" : "text-(--color-red)";

                return <div className={`font-semibold ${presenceColor}`}>{isPresent ? "Ingeklokt" : "Uitgeklokt"}</div>;
            },
        },
        {
            key: "schedules",
            label: "plek",
            render: row => {
                const weekday = new Date().getDay() - 1;
                const day = weekday < 0 || weekday > 4 ? 0 : weekday;
                const morningField = scheduleFieldsByDay[day * 2][0];
                const afternoonField = scheduleFieldsByDay[day * 2 + 1][0];
                const now = Date.now();

                const workplaceIds = new Set(
                    row.schedules
                        .filter(s => !s.endDate || s.endDate.getTime() > now)
                        .flatMap(s => [s[morningField], s[afternoonField]])
                        .filter(id => id != null),
                );

                return (
                    <div className="flex flex-wrap">
                        {workplaces
                            .filter(wp => workplaceIds.has(wp.id))
                            .map(wp => wp.name)
                            .join(", ")}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="max-h-120">
            <Table
                columns={participantColumns}
                rows={participants}
                setRows={setParticipants}
                checkBox={false}
                rowKey="id"
            />
        </div>
    );
}

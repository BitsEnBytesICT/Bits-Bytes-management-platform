import Table from "../../../common/components/Table";

import type IParticipant from "../../../types/compontents/IParticipant";
import type {ITableColumn} from "../../../types/compontents/ITable";

interface ISupportDashboardTable {
    participants: IParticipant[];
    setParticipants: (value: IParticipant[]) => void;
}

const participantColumns: ITableColumn<IParticipant>[] = [
    {key: "firstname", label: "Naam"},
    {key: "lastname", label: "Achternaam"},
    {key: "organisation", label: "Organisatie"},
    {
        key: "clockedin",
        label: "Aanwezig",
        render: row => {
            const isPresent = row.clockedin === 1;
            const presenceColor = isPresent ? "text-(--color-green)" : "text-(--color-red)";

            return <div className={`font-semibold ${presenceColor}`}>{isPresent ? "Aanwezig" : "Afwezig"}</div>;
        },
    },
];

export default function SupportDashboardTable({participants, setParticipants}: ISupportDashboardTable) {
    return (
        <Table
            columns={participantColumns}
            rows={participants}
            setRows={setParticipants}
            checkBox={false}
            rowKey="id"
        />
    );
}

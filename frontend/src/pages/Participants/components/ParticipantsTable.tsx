import Table from "../../../common/components/Table";

import type IParticipant from "../../../types/compontents/IParticipant";
import type {ITableColumn} from "../../../types/compontents/ITable";

import {IconDelete, IconEdit, IconInfo} from "../../../assets";

interface IParticipantsTable {
    participants: IParticipant[];
}

function ActionIcons() {
    return (
        <div className="flex flex-row gap-[10%]">
            <img
                onClick={() => {}}
                src={IconInfo}
                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
            <img
                onClick={() => {}}
                src={IconEdit}
                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
            <img
                onClick={() => {}}
                src={IconDelete}
                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
        </div>
    );
}

const participantColumns: ITableColumn<IParticipant>[] = [
    {key: "firstname", label: "Naam"},
    {key: "lastname", label: "Achternaam"},
    {key: "organisation", label: "Organisatie"},
    {
        key: "active",
        label: "Actief",
        render: row => (row.active ? "Actief" : "Inactief"),
    },
    {key: "rfid", label: "RFID Tag"},
    {
        key: "clockedin",
        label: "Aanwezig",
        render: row => {
            const isPresent = row.clockedin === 1;
            const presenceColor = isPresent ? "text-(--color-green)" : "text-(--color-red)";

            return <div className={`font-semibold ${presenceColor}`}>{isPresent ? "Aanwezig" : "Afwezig"}</div>;
        },
    },
    {key: "financing", label: "Financiering"},
    {
        key: "acties",
        label: "Acties",
        copyable: false,
        sortable: false,
        render: ActionIcons,
    },
];

export default function ParticipantsTable({participants}: IParticipantsTable) {
    return (
        <div className="flex-1 min-h-0">
            <Table columns={participantColumns} rows={participants} rowKey="id" />
        </div>
    );
}

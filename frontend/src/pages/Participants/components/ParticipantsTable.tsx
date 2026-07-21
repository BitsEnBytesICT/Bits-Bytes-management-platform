import {useState} from "react";

import SmallPopUp from "../../../common/components/SmallPopUp";
import Table from "../../../common/components/Table";

import EditParticipantPopUp from "./EditParticipantPopUp";
import InfoParticipantPopUp from "./InfoParticipantPopUp";

import type IParticipant from "../../../types/compontents/IParticipant";
import type {ITableColumn} from "../../../types/compontents/ITable";

import {IconDelete, IconEdit, IconInfo} from "../../../assets";

interface IParticipantsTable {
    participants: IParticipant[];
}

function ActionIcons(
    participant: IParticipant,
    onInfoClick: (participant: IParticipant) => void,
    onEditClick: (participant: IParticipant) => void,
    onDeleteClick: (participant: IParticipant) => void,
) {
    return (
        <div className="flex flex-row gap-[10%]">
            <img
                onClick={() => onInfoClick(participant)}
                src={IconInfo}
                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
            <img
                onClick={() => onEditClick(participant)}
                src={IconEdit}
                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
            <img
                onClick={() => onDeleteClick(participant)}
                src={IconDelete}
                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
        </div>
    );
}

export default function ParticipantsTable({participants}: IParticipantsTable) {
    const [infoParticipant, setInfoParticipant] = useState<IParticipant | null>(null);
    const [editParticipant, setEditParticipant] = useState<IParticipant | null>(null);
    const [deleteParticipant, setDeleteParticipant] = useState<IParticipant | null>(null);

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
            render: row => ActionIcons(row, setInfoParticipant, setEditParticipant, setDeleteParticipant),
        },
    ];

    return (
        <div className="flex-1 min-h-0">
            <Table columns={participantColumns} rows={participants} rowKey="id" />

            {infoParticipant && (
                <InfoParticipantPopUp participant={infoParticipant} onClose={() => setInfoParticipant(null)} />
            )}

            {editParticipant && (
                <EditParticipantPopUp participant={editParticipant} onClose={() => setEditParticipant(null)} />
            )}

            {deleteParticipant && (
                <SmallPopUp
                    title="Verwijderen"
                    message="Weet je dit zeker?"
                    onCancel={() => setDeleteParticipant(null)}
                    onConfirm={() => {
                        setDeleteParticipant(null);
                    }}
                />
            )}
        </div>
    );
}

import {useState} from "react";

import SmallPopUp from "../../../common/components/SmallPopUp";
import Table from "../../../common/components/Table";

import ParticipantPopUp from "./ParticipantPopUp";

import type IParticipant from "../../../types/compontents/IParticipant";
import type {ITableColumn} from "../../../types/compontents/ITable";

import {IconDelete, IconEdit, IconInfo} from "../../../assets";
import ParticipantsService from "../Participants.service";

interface IParticipantsTable {
    participants: IParticipant[];
    setParticipants: (value: IParticipant[]) => void;
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

export default function ParticipantsTable({participants, setParticipants}: IParticipantsTable) {
    const [infoParticipant, setInfoParticipant] = useState<IParticipant | null>(null);
    const [editParticipant, setEditParticipant] = useState<IParticipant | null>(null);
    const [deleteParticipant, setDeleteParticipant] = useState<IParticipant | null>(null);

    const service: ParticipantsService = new ParticipantsService();

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
                <ParticipantPopUp mode="info" participant={infoParticipant} onClose={() => setInfoParticipant(null)} />
            )}

            {editParticipant && (
                <ParticipantPopUp
                    mode="edit"
                    participant={editParticipant}
                    setParticipants={setParticipants}
                    onClose={() => setEditParticipant(null)}
                />
            )}

            {deleteParticipant && (
                <SmallPopUp
                    title="Verwijderen"
                    message={`Weet je zeker dat je ${deleteParticipant.firstname} ${deleteParticipant.lastname} wil verwijderen?`}
                    onCancel={() => setDeleteParticipant(null)}
                    onConfirm={async () => {
                        const account = await service.findAccount(
                            ["firstname", deleteParticipant.firstname],
                            ["lastname", deleteParticipant.lastname],
                        );
                        await service.deleteAccount(account.id);
                        setDeleteParticipant(null);
                        setParticipants(await service.getParticipants());
                    }}
                />
            )}
        </div>
    );
}

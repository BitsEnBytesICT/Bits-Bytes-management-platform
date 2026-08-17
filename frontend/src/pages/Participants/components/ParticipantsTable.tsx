import {useState} from "react";

import SmallPopUp from "../../../common/components/SmallPopUp";
import Table from "../../../common/components/Table";

import ParticipantPopUp from "./ParticipantPopUp";

import type IParticipant from "../../../types/compontents/IParticipant";
import type {ITableColumn} from "../../../types/compontents/ITable";

import {IconDelete, IconEdit, IconInfo} from "../../../assets";
import ParticipantsService from "../Participants.service";
import type IAccount from "../../../types/accounts/IAccount";

interface IParticipantsTable {
    filteredParticipants: (IParticipant & {checked: boolean})[];
    checkBox?: true;
    setParticipants: (value: IParticipant[]) => void;
    setFilteredParticipants: (value: (IParticipant & {checked: boolean})[]) => void;
}

function ActionIcons(
    participant: IParticipant,
    onInfoClick: (participantAndAccount: [IParticipant, IAccount]) => void,
    onEditClick: (participantAndAccount: [IParticipant, IAccount]) => void,
    onDeleteClick: (participant: IParticipant) => void,
) {
    const service: ParticipantsService = new ParticipantsService();

    return (
        <div className="flex flex-row gap-[10%]">
            <img
                onClick={async () =>
                    onInfoClick([
                        participant,
                        await service.findAccount(
                            ["firstname", participant.firstname],
                            ["lastname", participant.lastname],
                        ),
                    ])
                }
                src={IconInfo}
                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
            <img
                onClick={async () =>
                    onEditClick([
                        participant,
                        await service.findAccount(
                            ["firstname", participant.firstname],
                            ["lastname", participant.lastname],
                        ),
                    ])
                }
                src={IconEdit}
                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
            <img
                onClick={async () => onDeleteClick(participant)}
                src={IconDelete}
                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
            />
        </div>
    );
}

export default function ParticipantsTable({
    filteredParticipants,
    checkBox,
    setParticipants,
    setFilteredParticipants,
}: IParticipantsTable) {
    const [infoParticipant, setInfoParticipant] = useState<[IParticipant, IAccount] | null>(null);
    const [editParticipant, setEditParticipant] = useState<[IParticipant, IAccount] | null>(null);
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
            <Table
                columns={participantColumns}
                rows={filteredParticipants}
                setRows={setFilteredParticipants}
                rowKey="id"
                checkBox={checkBox}
            />

            {infoParticipant && (
                <ParticipantPopUp
                    mode="info"
                    participant={infoParticipant[0]}
                    account={infoParticipant[1]}
                    onClose={() => setInfoParticipant(null)}
                />
            )}

            {editParticipant && (
                <ParticipantPopUp
                    mode="edit"
                    participant={editParticipant[0]}
                    setParticipants={setParticipants}
                    account={editParticipant[1]}
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

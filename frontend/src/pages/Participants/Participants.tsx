import {useEffect, useState} from "react";

import Table from "../../common/components/Table";
import SmallButton from "../../common/components/SmallButton";

import ParticipantsService from "./Participants.service";

import type IParticipant from "../../types/compontents/IParticipant";
import type {ITableColumn} from "../../types/compontents/ITable";

import {IconFilter, IconAddUser, IconExport, IconEdit, IconDelete, IconInfo} from "../../assets";

const participantColumns: ITableColumn<IParticipant>[] = [
    {key: "firstname", label: "Naam"},
    {key: "lastname", label: "Achternaam"},
    {key: "organisation", label: "Organisatie"},
    {
        key: "active",
        label: "Actief",
        render: row => (row.active ? "Actief" : "Inactief"),
    },
    {key: "rfid", label: "RFID TAG"},
    {
        key: "clockedin",
        label: "Aanwezig",
        render: row => {
            const present = row.clockedin === 1;
            return (
                <div className={present ? "font-semibold text-(--color-green)" : "font-semibold text-(--color-red)"}>
                    {present ? "Aanwezig" : "Afwezig"}
                </div>
            );
        },
    },
    {key: "financing", label: "Financiering"},
    {
        key: "acties",
        label: "Acties",
        render: () => (
            <div className="flex flex-row gap-[10%]">
                <img
                    className="shrink-0 select-none [-webkit-user-drag:none] cursor-pointer"
                    src={IconInfo}
                    onClick={() => {}}
                />

                <img
                    className="shrink-0 select-none [-webkit-user-drag:none] cursor-pointer"
                    src={IconEdit}
                    onClick={() => {}}
                />

                <img
                    className="shrink-0 select-none [-webkit-user-drag:none] cursor-pointer"
                    src={IconDelete}
                    onClick={() => {}}
                />
            </div>
        ),
    },
];

export default function Participants() {
    const [participants, setParticipants] = useState<IParticipant[]>([]);

    const service: ParticipantsService = new ParticipantsService();

    useEffect(() => {
        service.getParticipants().then(setParticipants);
    }, []);

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-10rem)]">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-6">
                    <SmallButton
                        icon={<img className="select-none [-webkit-user-drag:none]" src={IconFilter} />}
                        label="Filter"
                        onClick={() => console.log("must be a different action")}
                    />
                </div>

                <div className="flex flex-row gap-6">
                    <SmallButton
                        icon={<img className="select-none [-webkit-user-drag:none]" src={IconAddUser} />}
                        label="Deelnemer toevoegen"
                        onClick={() => console.log("must be a different action")}
                    />

                    <SmallButton
                        icon={<img className="select-none [-webkit-user-drag:none]" src={IconExport} />}
                        label="Exporteer"
                        onClick={() => console.log("must be a different action")}
                    />
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <Table columns={participantColumns} rows={participants} rowKey="id" />
            </div>
        </div>
    );
}

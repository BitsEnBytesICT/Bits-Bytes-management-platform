import {useEffect, useRef, useState} from "react";

import Filter from "../../common/components/Filter";
import SmallButton from "../../common/components/SmallButton";
import Table from "../../common/components/Table";

import useLocalStorage from "../../common/hooks/useLocalStorage";

import ParticipantsService from "./Participants.service";

import type IParticipant from "../../types/compontents/IParticipant";
import type {ITableColumn} from "../../types/compontents/ITable";

import {IconAddUser, IconDelete, IconEdit, IconExport, IconFilter, IconInfo} from "../../assets";

function getActiveLabel(participant: IParticipant): "Actief" | "Inactief" {
    return participant.active ? "Actief" : "Inactief";
}

function getPresenceLabel(participant: IParticipant): "Aanwezig" | "Afwezig" {
    return participant.clockedin === 1 ? "Aanwezig" : "Afwezig";
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
        render: getActiveLabel,
    },
    {key: "rfid", label: "RFID Tag"},
    {
        key: "clockedin",
        label: "Aanwezig",
        render: row => {
            const isPresent = row.clockedin === 1;
            const presenceColor = isPresent ? "text-(--color-green)" : "text-(--color-red)";

            return <div className={`font-semibold ${presenceColor}`}>{getPresenceLabel(row)}</div>;
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

export default function Participants() {
    const [participants, setParticipants] = useState<IParticipant[]>([]);
    const [isFilterShown, setIsFilterShown] = useState(false);
    const [filterHeight, setFilterHeight] = useState(0);

    const [organisationFilter, setOrganisationFilter] = useLocalStorage("participants.organisationFilter", "");
    const [activeFilter, setActiveFilter] = useLocalStorage("participants.activeFilter", "");
    const [presentFilter, setPresentFilter] = useLocalStorage("participants.presentFilter", "");
    const [financingFilter, setFinancingFilter] = useLocalStorage("participants.financingFilter", "");

    const filterContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const service = new ParticipantsService();

        service.getParticipants().then(setParticipants);
    }, []);

    useEffect(() => {
        setFilterHeight(isFilterShown ? (filterContentRef.current?.scrollHeight ?? 0) : 0);
    }, [isFilterShown]);

    const organisations = [...new Set(participants.map(participant => participant.organisation))];
    const financingOptions = [...new Set(participants.map(participant => participant.financing).filter(Boolean))];

    function matchesFilters(participant: IParticipant): boolean {
        const matchesOrganisation = !organisationFilter || participant.organisation === organisationFilter;
        const matchesActive = !activeFilter || getActiveLabel(participant) === activeFilter;
        const matchesPresence = !presentFilter || getPresenceLabel(participant) === presentFilter;
        const matchesFinancing = !financingFilter || participant.financing === financingFilter;

        return matchesOrganisation && matchesActive && matchesPresence && matchesFinancing;
    }

    const filteredParticipants = participants.filter(matchesFilters);

    const filterGroups = [
        {
            label: "Organisatie",
            options: organisations,
            value: organisationFilter,
            onChange: setOrganisationFilter,
        },
        {
            label: "Actief",
            options: ["Actief", "Inactief"],
            value: activeFilter,
            onChange: setActiveFilter,
        },
        {
            label: "Aanwezig",
            options: ["Aanwezig", "Afwezig"],
            value: presentFilter,
            onChange: setPresentFilter,
        },
        {
            label: "Financiering",
            options: financingOptions,
            value: financingFilter,
            onChange: setFinancingFilter,
        },
    ];

    function handleFilterToggle() {
        setIsFilterShown(prev => !prev);
    }

    function handleAddParticipant() {
        console.log("must be a different action");
    }

    function handleExport() {
        console.log("must be a different action");
    }

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <div className="mb-4 flex flex-row justify-between">
                <div className="flex flex-row gap-6">
                    <SmallButton
                        onClick={handleFilterToggle}
                        icon={<img src={IconFilter} className="select-none [-webkit-user-drag:none]" />}
                        label="Filter"
                        active={isFilterShown}
                    />
                </div>

                <div className="flex flex-row gap-6">
                    <SmallButton
                        onClick={handleAddParticipant}
                        icon={<img src={IconAddUser} className="select-none [-webkit-user-drag:none]" />}
                        label="Deelnemer toevoegen"
                    />

                    <SmallButton
                        onClick={handleExport}
                        icon={<img src={IconExport} className="select-none [-webkit-user-drag:none]" />}
                        label="Exporteer"
                    />
                </div>
            </div>

            <div
                className={`${isFilterShown ? "mb-4" : "mb-0"} overflow-hidden transition-[height,margin-bottom]
                    duration-300 ease-in-out`}
                style={{height: filterHeight}}>
                <div ref={filterContentRef}>
                    <Filter filters={filterGroups} />
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <Table columns={participantColumns} rows={filteredParticipants} rowKey="id" />
            </div>
        </div>
    );
}

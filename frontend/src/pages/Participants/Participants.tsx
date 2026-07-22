import {useEffect, useRef, useState} from "react";

import Filter from "../../common/components/Filter";
import SmallButton from "../../common/components/SmallButton";
import Table from "../../common/components/Table";

import useLocalStorage from "../../common/hooks/useLocalStorage";

import ParticipantsService from "./Participants.service";

import type IParticipant from "../../types/compontents/IParticipant";
import type {ITableColumn} from "../../types/compontents/ITable";

import {IconAddUser, IconDelete, IconEdit, IconExport, IconFilter, IconInfo} from "../../assets";

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

export default function Participants() {
    const [participants, setParticipants] = useState<IParticipant[]>([]);
    const [isFilterShown, setIsFilterShown] = useState(false);
    const [filterHeight, setFilterHeight] = useState(0);

    const [searchTerm, setSearchTerm] = useLocalStorage("participants.searchTerm", "");
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
        const term = searchTerm.toLowerCase();

        const matchesSearch =
            !searchTerm ||
            Object.values(participant).some(value =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(term),
            );
        const matchesOrganisation = !organisationFilter || participant.organisation === organisationFilter;
        const matchesActive = !activeFilter || (participant.active ? "Actief" : "Inactief") === activeFilter;
        const matchesPresence =
            !presentFilter || (participant.clockedin === 1 ? "Aanwezig" : "Afwezig") === presentFilter;
        const matchesFinancing = !financingFilter || participant.financing === financingFilter;

        return matchesSearch && matchesOrganisation && matchesActive && matchesPresence && matchesFinancing;
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

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <div className="mb-4 flex flex-row justify-between">
                <div className="flex flex-row gap-6">
                    <SmallButton
                        onClick={() => setIsFilterShown(prev => !prev)}
                        icon={<img src={IconFilter} className="select-none [-webkit-user-drag:none]" />}
                        label="Filter"
                        active={isFilterShown}
                    />
                </div>

                <div className="flex flex-row gap-6">
                    <SmallButton
                        onClick={() => console.log("Deelnemer toevoegen")}
                        icon={<img src={IconAddUser} className="select-none [-webkit-user-drag:none]" />}
                        label="Deelnemer toevoegen"
                    />

                    <SmallButton
                        onClick={() => console.log("xporteer")}
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
                    <Filter
                        filters={filterGroups}
                        search={{
                            value: searchTerm,
                            onChange: setSearchTerm,
                            placeholder: "Zoek",
                        }}
                    />
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <Table columns={participantColumns} rows={filteredParticipants} rowKey="id" />
            </div>
        </div>
    );
}

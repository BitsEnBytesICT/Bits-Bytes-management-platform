import {useEffect, useRef, useState} from "react";
import type {ReactNode} from "react";

import Filter from "../../../common/components/Filter";

import useLocalStorage from "../../../common/hooks/useLocalStorage";

import type IParticipant from "../../../types/compontents/IParticipant";

interface IParticipantsFilter {
    participants: IParticipant[];
    isShown: boolean;
    children: (filteredParticipants: (IParticipant & {checked: boolean})[]) => ReactNode;
    setFilteredParticipants: (value: (IParticipant & {checked: boolean})[]) => void;
}

export default function ParticipantsFilter({
    participants,
    isShown,
    children,
    setFilteredParticipants,
}: IParticipantsFilter) {
    const [searchTerm, setSearchTerm] = useLocalStorage("participants.searchTerm", "");
    const [organisationFilter, setOrganisationFilter] = useLocalStorage("participants.organisationFilter", "");
    const [activeFilter, setActiveFilter] = useLocalStorage("participants.activeFilter", "");
    const [presentFilter, setPresentFilter] = useLocalStorage("participants.presentFilter", "");
    const [financingFilter, setFinancingFilter] = useLocalStorage("participants.financingFilter", "");
    const [filterHeight, setFilterHeight] = useState(0);

    const filterContentRef = useRef<HTMLDivElement>(null);

    let filteredParticipants: (IParticipant & {checked: boolean})[];

    useEffect(() => {
        setFilterHeight(isShown ? (filterContentRef.current?.scrollHeight ?? 0) : 0);
    }, [isShown]);

    useEffect(() => {
        filteredParticipants = participants.filter(matchesFilters).map(p => ({...p, checked: false}));
        setFilteredParticipants(filteredParticipants);
    }, [participants, searchTerm, organisationFilter, activeFilter, presentFilter, financingFilter]);

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
        <>
            <div
                className={`${isShown ? "mb-4" : "mb-0"} overflow-hidden transition-[height,margin-bottom] duration-300
                    ease-in-out`}
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

            {children(filteredParticipants)}
        </>
    );
}

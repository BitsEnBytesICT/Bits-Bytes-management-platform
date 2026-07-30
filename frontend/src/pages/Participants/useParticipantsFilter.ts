import useLocalStorage from "../../common/hooks/useLocalStorage";

import type IParticipant from "../../types/compontents/IParticipant";
import type {IFilterOption, IFilterSearch} from "../../types/compontents/IFilter";

interface IUseParticipantsFilter {
    filteredParticipants: IParticipant[];
    filters: IFilterOption[];
    search: IFilterSearch;
}

export default function useParticipantsFilter(participants: IParticipant[]): IUseParticipantsFilter {
    const [searchTerm, setSearchTerm] = useLocalStorage("participants.searchTerm", "");
    const [organisationFilter, setOrganisationFilter] = useLocalStorage("participants.organisationFilter", "");
    const [activeFilter, setActiveFilter] = useLocalStorage("participants.activeFilter", "");
    const [presentFilter, setPresentFilter] = useLocalStorage("participants.presentFilter", "");
    const [financingFilter, setFinancingFilter] = useLocalStorage("participants.financingFilter", "");

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

    return {
        filteredParticipants: participants.filter(matchesFilters),
        filters: [
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
        ],
        search: {
            value: searchTerm,
            onChange: setSearchTerm,
            placeholder: "Zoek",
        },
    };
}

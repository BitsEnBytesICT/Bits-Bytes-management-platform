import {useEffect, useState} from "react";

import SmallButton from "../../common/components/SmallButton";

import useLocalStorage from "../../common/hooks/useLocalStorage";

import ParticipantPopUp from "./components/ParticipantPopUp";
import ParticipantsFilter from "./components/ParticipantsFilter";
import ParticipantsTable from "./components/ParticipantsTable";

import PDFGenerator from "../SupportDashboard/components/PDFGenerator";

import ParticipantsService from "./Participants.service";

import type IParticipant from "../../types/compontents/IParticipant";
import {ButtonType} from "../../types/compontents/ISmallButton";

import {IconAddUser, IconExport, IconFilter} from "../../assets";

export default function Participants() {
    const [participants, setParticipants] = useState<IParticipant[]>([]);
    const [isFilterShown, setIsFilterShown] = useState(false);
    const [isAddParticipantShown, setIsAddParticipantShown] = useState(false);

    const [searchTerm, setSearchTerm] = useLocalStorage("participants.searchTerm", "");
    const [organisationFilter, setOrganisationFilter] = useLocalStorage("participants.organisationFilter", "");
    const [activeFilter, setActiveFilter] = useLocalStorage("participants.activeFilter", "");
    const [presentFilter, setPresentFilter] = useLocalStorage("participants.presentFilter", "");
    const [financingFilter, setFinancingFilter] = useLocalStorage("participants.financingFilter", "");

    useEffect(() => {
        const service = new ParticipantsService();

        service.getParticipants().then(setParticipants);
    }, []);

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
                        onClick={() => setIsAddParticipantShown(true)}
                        icon={<img src={IconAddUser} className="select-none [-webkit-user-drag:none]" />}
                        label="Deelnemer toevoegen"
                    />

                    {filteredParticipants.length > 0 && (
                        <SmallButton
                            type={ButtonType.DOWNLOAD}
                            document={<PDFGenerator data={filteredParticipants} />}
                            filename="participant-export.pdf"
                            icon={<img src={IconExport} className="select-none [-webkit-user-drag:none]" />}
                            label="Exporteer"
                        />
                    )}
                </div>
            </div>

            <ParticipantsFilter
                filters={filterGroups}
                search={{value: searchTerm, onChange: setSearchTerm, placeholder: "Zoek"}}
                isShown={isFilterShown}
            />

            <ParticipantsTable participants={filteredParticipants} />

            {isAddParticipantShown && <ParticipantPopUp mode="add" onClose={() => setIsAddParticipantShown(false)} />}
        </div>
    );
}

import {useEffect, useState} from "react";

import SmallButton from "../../common/components/SmallButton";

import ParticipantPopUp from "./components/ParticipantPopUp";
import ParticipantsFilter from "./components/ParticipantsFilter";
import ParticipantsTable from "./components/ParticipantsTable";

import ParticipantsService from "./Participants.service";

import type IParticipant from "../../types/compontents/IParticipant";

import {IconAddUser, IconDelete, IconExport, IconFilter} from "../../assets";

import buildPDF from "../../common/buildPDF";
import SmallPopUp from "../../common/components/SmallPopUp";

export default function Participants() {
    const [participants, setParticipants] = useState<IParticipant[]>([]);
    const [isFilterShown, setIsFilterShown] = useState(false);
    const [isAddParticipantShown, setIsAddParticipantShown] = useState(false);
    const [filteredParticipants, setFilteredParticipants] = useState<(IParticipant & {checked: boolean})[]>([]);
    const [hasSelected, setHasSelected] = useState<boolean>();
    const [deleteParticipants, setDeleteParticipants] = useState<boolean>();

    const service = new ParticipantsService();

    useEffect(() => {
        setHasSelected(filteredParticipants.some(p => p.checked));
    }, [filteredParticipants]);

    useEffect(() => {
        service.getParticipants().then(participants => {
            setParticipants(participants);
        });
    }, []);

    async function bulkDeleteParticipants() {
        const checkedParticipants = filteredParticipants.filter(p => p.checked);
        for (const participant of checkedParticipants) {
            await service.deleteAccount(participant.account);
        }
        service.getParticipants().then(setParticipants);
    }

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
                    {hasSelected && (
                        <>
                            <SmallButton
                                classNameExtra="animate-[fade-in_0.3s_ease-in-out]"
                                onClick={() => setDeleteParticipants(true)}
                                icon={<img src={IconDelete} className="select-none [-webkit-user-drag:none]" />}
                                label="Selectie verwijderen"
                            />
                            <SmallButton
                                classNameExtra="animate-[fade-in_0.3s_ease-in-out]"
                                onClick={() => buildPDF(filteredParticipants.filter(p => p.checked))}
                                icon={<img src={IconExport} className="select-none [-webkit-user-drag:none]" />}
                                label="Selectie exporteren"
                            />
                        </>
                    )}
                    <SmallButton
                        onClick={() => setIsAddParticipantShown(true)}
                        icon={<img src={IconAddUser} className="select-none [-webkit-user-drag:none]" />}
                        label="Deelnemer toevoegen"
                    />

                    <SmallButton
                        onClick={() => buildPDF(filteredParticipants)}
                        icon={<img src={IconExport} className="select-none [-webkit-user-drag:none]" />}
                        label="Exporteer"
                    />
                </div>
            </div>

            <ParticipantsFilter
                participants={participants}
                isShown={isFilterShown}
                setFilteredParticipants={setFilteredParticipants}>
                {() => (
                    <ParticipantsTable
                        filteredParticipants={filteredParticipants}
                        checkBox={true}
                        setParticipants={setParticipants}
                        setFilteredParticipants={setFilteredParticipants}
                    />
                )}
            </ParticipantsFilter>

            {isAddParticipantShown && (
                <ParticipantPopUp
                    mode="add"
                    setParticipants={setParticipants}
                    onClose={() => setIsAddParticipantShown(false)}
                />
            )}

            {deleteParticipants && (
                <SmallPopUp
                    title="Verwijderen"
                    message={`Weet je zeker dat je ${filteredParticipants.filter(p => p.checked).length} deelnemers wil verwijderen?`}
                    onCancel={() => setDeleteParticipants(false)}
                    onConfirm={async () => {
                        bulkDeleteParticipants();
                        setDeleteParticipants(false);
                    }}
                />
            )}
        </div>
    );
}

import {useEffect, useState} from "react";

import SmallButton from "../../common/components/SmallButton";

import AddParticipantPopUp from "./components/AddParticipantPopUp";
import ParticipantsFilter from "./components/ParticipantsFilter";
import ParticipantsTable from "./components/ParticipantsTable";

import ParticipantsService from "./Participants.service";

import type IParticipant from "../../types/compontents/IParticipant";

import {IconAddUser, IconExport, IconFilter} from "../../assets";

export default function Participants() {
    const [participants, setParticipants] = useState<IParticipant[]>([]);
    const [isFilterShown, setIsFilterShown] = useState(false);
    const [isAddParticipantShown, setIsAddParticipantShown] = useState(false);

    useEffect(() => {
        const service = new ParticipantsService();

        service.getParticipants().then(setParticipants);
    }, []);

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

                    <SmallButton
                        onClick={() => console.log("exporteer")}
                        icon={<img src={IconExport} className="select-none [-webkit-user-drag:none]" />}
                        label="Exporteer"
                    />
                </div>
            </div>

            <ParticipantsFilter participants={participants} isShown={isFilterShown}>
                {filteredParticipants => <ParticipantsTable participants={filteredParticipants} />}
            </ParticipantsFilter>

            {isAddParticipantShown && <AddParticipantPopUp onClose={() => setIsAddParticipantShown(false)} />}
        </div>
    );
}

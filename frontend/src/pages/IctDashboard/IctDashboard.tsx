import DateTimeDisplay from "../../common/components/DateTimeDisplay";
import Card from "../../common/components/Card";
import Shortcuts from "../../common/components/Shortcuts/Shortcuts";
import {IconSettings, IconVMs} from "../../assets";
import SmallButton from "../../common/components/SmallButton";
import IctDashboardTable from "./components/IctDashboardTable";
import {useState} from "react";
import IctPopUp from "./components/ictpopup.tsx";
import FloorplansPopUp from "../../common/components/floorplans/FloorplansPopUp";
import type {IRoom} from "../../types/floorPlans/IRoom";
import {type IParticipantWithSchedules} from "../../types/compontents/IParticipant";
import {type IWorkplace} from "../../types/floorPlans/IWorkplace";
import FloorPlans from "../../common/components/floorplans/FloorPlans.tsx";
import SupportDashboardService from "../SupportDashboard/SupportDashboard.service.ts";
import {useEffect} from "react";

let storageUsed = 20;
let storageTotal = 40;
let vmOnline = 4;

export default function IctDashboard() {
    const [isAddVmShown, setIsAddVmShown] = useState<boolean>(false);
    const [serverOnline, setServerOnline] = useState<any[]>([]);
    const [participants, setParticipants] = useState<IParticipantWithSchedules[]>([]);
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [workplaces, setWorkplaces] = useState<IWorkplace[]>([]);
    const [totalParticipants, setTotalParticipants] = useState<number>(0);
    const [presentParticipants, setPresentParticipants] = useState<IParticipantWithSchedules[]>([]);
    const [clockedin, setClockedin] = useState(0);

    useEffect(() => {
        const service = new SupportDashboardService();

        const getData = async () => {
            await service.getTotalParticipants().then(setTotalParticipants);
            await service.getPresentParticipants().then(participants => {
                service.getScedules().then(schedules => {
                    setPresentParticipants(
                        participants.map(p => {
                            const schedule = schedules.filter(s => s.participant === p.id);
                            return {...p, schedules: schedule};
                        }),
                    );
                });
            });
            await service.getParticipants().then(participants => {
                service.getScedules().then(schedules => {
                    setParticipants(
                        participants.map(p => {
                            const schedule = schedules.filter(s => s.participant === p.id);
                            return {...p, schedules: schedule};
                        }),
                    );
                });
            });
            await service.getWorkplaces().then(setWorkplaces);
            await service.getRooms().then(setRooms);
            await service.getClockedinParticipants().then(setClockedin);
        };

        Promise.all([getData()]);
    }, []);

    return (
        <>
            <div className="flex flex-col gap-25">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col gap-6">
                        <div className="text-[22px] font-semibold text-(--color-darkblue)">ICT-Dashboard</div>
                        <DateTimeDisplay />
                    </div>
                    <div className="flex flex-row gap-8 min-[1000px]:gap-16">
                        <Card title="VM's Online" value={vmOnline} />
                        <Card title="Opslag Windows:" value={`${storageUsed}GB/${storageTotal}GB`} />
                    </div>
                </div>
                <Shortcuts />
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row justify-end">
                        <div className="flex flex-row gap-6">
                            <SmallButton
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconVMs} />}
                                label="VM Toevoegen"
                                onClick={() => setIsAddVmShown(true)}
                            />
                            <SmallButton
                                label="Beheer"
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconSettings} />}
                                active={false}
                            />
                        </div>
                    </div>
                    <IctDashboardTable serverOnline={serverOnline} setServerOnline={setServerOnline} />
                </div>
                <FloorPlans
                    rooms={rooms}
                    participants={participants}
                    PopUpContent={FloorplansPopUp}
                    setParticipants={setParticipants}
                    workplaces={workplaces}
                />
            </div>
            {isAddVmShown && <IctPopUp setIsAddVmShown={setIsAddVmShown} onClose={() => setIsAddVmShown(false)} />}
        </>
    );
}

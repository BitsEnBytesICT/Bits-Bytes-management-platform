import {useEffect, useState} from "react";

import DateTimeDisplay from "../../common/components/DateTimeDisplay";
import Card from "../../common/components/Card";
import FloorPlans from "../../common/components/floorplans/FloorPlans";
import Shortcuts from "../../common/components/Shortcuts/Shortcuts";
import Calendar from "../../common/components/Calendar/Calendar";
import SmallButton from "../../common/components/SmallButton";

import SupportDashboardTable from "./components/SupportDashboardTable";

import ParticipantPopUp from "../Participants/components/ParticipantPopUp";

import FloorplansPopUp from "../../common/components/floorplans/FloorplansPopUp";

import SupportDashboardService from "./SupportDashboard.service";

import type {IRoom} from "../../types/floorPlans/IRoom";

import {IconAddUser, IconExport} from "../../assets";

import {type IParticipant, type IParticipantWithSchedules} from "../../types/compontents/IParticipant";
import {type IWorkplace} from "../../types/floorPlans/IWorkplace";
import {downloadPDF} from "../../common/buildPDF";
import AttendanceExportPDF from "./components/AttendancesPDF";
import {scheduleFieldsByDay} from "../../types/schedules/ISchedule";

export default function SupportDashboard() {
    const [totalParticipants, setTotalParticipants] = useState(0);
    const [presentParticipants, setPresentParticipants] = useState<IParticipantWithSchedules[]>([]);
    const [participants, setParticipants] = useState<IParticipantWithSchedules[]>([]);
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [isAddParticipantShown, setIsAddParticipantShown] = useState(false);
    const [clockedin, setClockedin] = useState(0);
    const [workplaces, setWorkplaces] = useState<IWorkplace[]>([]);

    const [morningParticipants, setMorningParticipants] = useState<IParticipant[]>([]);
    const [afternoonParticipants, setAfternoonParticipants] = useState<IParticipant[]>([]);
    const [fullDayParticipants, setFullDayParticipants] = useState<IParticipant[]>([]);

    useEffect(() => {
        const service = new SupportDashboardService();

        let day = new Date().getDay() - 1;
        if (day > 4 || day < 0) day = 0;

        const getData = async () => {
            await service.getTotalParticipants().then(setTotalParticipants);
            await service.getPresentParticipants().then(participants => {
                service.getScedules().then(schedules => {
                    setPresentParticipants(
                        participants.map(p => {
                            const schedule = schedules.filter(s => s.participant === p.id);
                            const activeSchedule = schedule.filter(
                                s =>
                                    s.startDate.getTime() < Date.now() &&
                                    ((s.endDate && s.endDate.getTime() > Date.now()) || !s.endDate) &&
                                    (s[scheduleFieldsByDay[day * 2][0]] || s[scheduleFieldsByDay[day * 2 + 1][0]]),
                            );
                            if (
                                activeSchedule.length > 0 &&
                                activeSchedule[0][scheduleFieldsByDay[day * 2][0]] &&
                                activeSchedule[0][scheduleFieldsByDay[day * 2 + 1][0]]
                            )
                                fullDayParticipants.push(p);
                            else if (activeSchedule.length > 0 && activeSchedule[0][scheduleFieldsByDay[day * 2][0]])
                                morningParticipants.push(p);
                            else if (
                                activeSchedule.length > 0 &&
                                activeSchedule[0][scheduleFieldsByDay[day * 2 + 1][0]]
                            )
                                afternoonParticipants.push(p);
                            return {...p, schedules: schedule};
                        }),
                    );

                    setMorningParticipants([...morningParticipants]);
                    setAfternoonParticipants([...afternoonParticipants]);
                    setFullDayParticipants([...fullDayParticipants]);
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
                        <div className="text-[22px] font-semibold text-(--color-darkblue)">Dashboard</div>

                        <DateTimeDisplay />
                    </div>

                    <div className="flex flex-row gap-8 min-[1000px]:gap-16">
                        <Card title="Deelnemers aanwezig:" value={clockedin} />
                        <Card title="Deelnemers totaal:" value={totalParticipants} />
                    </div>
                </div>

                <Shortcuts />

                <div className="flex flex-col gap-4">
                    <div className="flex flex-row justify-end">
                        <div className="flex flex-row gap-6">
                            <SmallButton
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconAddUser} />}
                                label="Deelnemer toevoegen"
                                onClick={() => setIsAddParticipantShown(true)}
                            />

                            <SmallButton
                                label="Exporteer"
                                icon={<img className="select-none [-webkit-user-drag:none]" src={IconExport} />}
                                active={false}
                                onClick={async () =>
                                    await downloadPDF(
                                        <AttendanceExportPDF
                                            morningParticipants={morningParticipants}
                                            afternoonParticipants={afternoonParticipants}
                                            fullDayParticipants={fullDayParticipants}
                                        />,
                                        "aanwezigheidsplanning-export.pdf",
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <SupportDashboardTable
                            participants={presentParticipants}
                            setParticipants={setPresentParticipants}
                            workplaces={workplaces}
                        />
                    </div>
                </div>

                <Calendar />

                <FloorPlans
                    rooms={rooms}
                    participants={participants}
                    PopUpContent={FloorplansPopUp}
                    setParticipants={setParticipants}
                    workplaces={workplaces}
                />
            </div>

            {isAddParticipantShown && (
                <ParticipantPopUp
                    mode="add"
                    participants={participants}
                    rooms={rooms}
                    setParticipants={setParticipants}
                    onClose={() => setIsAddParticipantShown(false)}
                />
            )}
        </>
    );
}

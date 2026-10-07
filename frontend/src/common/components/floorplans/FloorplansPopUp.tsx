import {useEffect, useRef} from "react";
import type {IParticipantWithSchedules} from "../../../types/compontents/IParticipant";
import type IFloorplansPopUp from "../../../types/floorPlans/floorplantsPopUp";
import type ISchedule from "../../../types/schedules/ISchedule";
import {scheduleFieldsByDay} from "../../../types/schedules/ISchedule";
import type {KeyValuePair} from "../../../types/validation/keyvaluePair";
import Input from "../Input";
import FloorplansService from "./floorplans.service";

export default function FloorplansPopUp({
    currentWorkplace,
    participants,
    setParticipants,
    setCurrentWorkplace,
    setWorkplaces,
    workplaces,
    currentDay,
}: IFloorplansPopUp<unknown>) {
    const extraInfoChanged = useRef<boolean>(false);
    const latestWorkplace = useRef(currentWorkplace);

    const occupancyStatuses = [
        {label: "Vrij", color: "text-(--color-green)"},
        {label: "Deels", color: "text-(--color-yellow)"},
        {label: "Bezet", color: "text-(--color-red)"},
    ];
    const occupancyStatus =
        occupancyStatuses[
            [
                currentWorkplace.timeslots[currentDay].Ochtend !== "Vrij",
                currentWorkplace.timeslots[currentDay].Middag !== "Vrij",
            ].filter(item => item === true).length
        ];

    const floorplansService: FloorplansService = new FloorplansService();

    useEffect(() => {
        latestWorkplace.current = currentWorkplace;
    }, [currentWorkplace]);

    useEffect(() => {
        return () => {
            if (extraInfoChanged.current)
                floorplansService.updateWorkplace(
                    ["id", latestWorkplace.current.id],
                    ["extraInfo", latestWorkplace.current.extraInfo],
                );
        };
    }, []);

    return (
        <div
            className="px-5 py-5 flex flex-col gap-3 text-sm font-medium text-(--color-darkblue) bg-(--color-white)
                rounded-2xl shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
            <div className="flex flex-row justify-between text-base">
                <span>Plek {currentWorkplace?.name}</span>

                <span className={occupancyStatus.color}>{occupancyStatus.label}</span>
            </div>

            <div className="h-px bg-(--color-black)/5"></div>

            {Object.keys(currentWorkplace.timeslots[currentDay]).map((timeslot, index) => (
                <div key={timeslot} className="flex flex-row gap-3 items-center">
                    <span
                        className={`size-2.5 shrink-0 rounded-full
                        ${currentWorkplace.timeslots[currentDay][timeslot] === "Vrij" ? "bg-(--color-green)" : "bg-(--color-red)"}`}></span>

                    <label
                        htmlFor={`participant-${currentWorkplace.id}-${index}`}
                        className="w-20 text-(--color-darkblue)/50">
                        {timeslot}
                    </label>

                    <Input
                        key={`${currentWorkplace.id}-${index}`}
                        id={`participant-${currentWorkplace.id}-${index}`}
                        type="select"
                        options={[
                            {value: "Vrij", label: "Vrij"},
                            ...participants.map(p => ({
                                value: `${p.firstname} ${p.lastname}`,
                                label: `${p.firstname} ${p.lastname}`,
                            })),
                        ]}
                        value={currentWorkplace.timeslots[currentDay][timeslot]}
                        onChange={async value => {
                            let participant: IParticipantWithSchedules;
                            if (value !== "Vrij")
                                participant = participants.find(p => `${p.firstname} ${p.lastname}` === value);
                            else
                                participant = participants.find(
                                    p =>
                                        `${p.firstname} ${p.lastname}` ===
                                        currentWorkplace.timeslots[currentDay][timeslot],
                                );

                            const changedSchedule = participant.schedules.find(
                                schedule => schedule[scheduleFieldsByDay[currentDay * 2 + index][0]] !== null,
                            );

                            const openSchedule = participant.schedules.find(
                                s => !s.endDate || s.endDate.getTime() > Date.now(),
                            );

                            const schedule = changedSchedule ? changedSchedule : openSchedule;

                            if (!schedule) {
                                const newSchedule = {
                                    name: "gemaakt via floorplanner",
                                    startDate: new Date(),
                                    participant: participant.id,
                                    [scheduleFieldsByDay[currentDay * 2 + index][0]]:
                                        value === "Vrij" ? undefined : currentWorkplace.id,
                                };
                                await floorplansService.createScedule(newSchedule);
                                participant.schedules.push(newSchedule);
                                setParticipants(participants.map(p => (p.id === participant.id ? participant : p)));
                            } else {
                                schedule[scheduleFieldsByDay[currentDay * 2 + index][0]] =
                                    value === "Vrij" ? undefined : currentWorkplace.id;
                                const updatedFields = (Object.keys(schedule) as Array<keyof ISchedule>).map(key => [
                                    key,
                                    schedule[key],
                                ]);
                                await floorplansService.updateScedule(
                                    ["id", schedule.id],
                                    ...(updatedFields as KeyValuePair<ISchedule>[]),
                                );
                            }

                            const updatedWorkplace = {
                                ...currentWorkplace,
                                timeslots: currentWorkplace.timeslots.map((slots, day) =>
                                    day === currentDay ? {...slots, [timeslot]: value} : slots,
                                ),
                            };

                            const updatedWorkplaces = workplaces.map(workplace => {
                                if (workplace.id === updatedWorkplace.id) return updatedWorkplace;
                                if (value !== "Vrij" && workplace.timeslots[currentDay][timeslot] === value) {
                                    return {
                                        ...workplace,
                                        timeslots: workplace.timeslots.map((slots, day) =>
                                            day === currentDay ? {...slots, [timeslot]: "Vrij"} : slots,
                                        ),
                                    };
                                }
                                return workplace;
                            });

                            setCurrentWorkplace(updatedWorkplace);
                            setWorkplaces(updatedWorkplaces);
                        }}
                        className={`flex-1 min-w-0
                        ${currentWorkplace.timeslots[currentDay][timeslot] === "Vrij" ? "text-(--color-darkblue)/50" : ""}`}
                    />
                </div>
            ))}
            <Input
                key={currentWorkplace.id}
                value={currentWorkplace.extraInfo}
                onChange={value => {
                    const updatedWorkplace = {...currentWorkplace, extraInfo: value};
                    setCurrentWorkplace(updatedWorkplace);
                    setWorkplaces(previous =>
                        previous.map(workplace =>
                            workplace.id === updatedWorkplace.id ? updatedWorkplace : workplace,
                        ),
                    );
                    extraInfoChanged.current = true;
                }}
                id="notities"
                type="textarea"
                label="Notities"
                labelClassName="font-medium text-(--color-darkblue)"
            />
        </div>
    );
}

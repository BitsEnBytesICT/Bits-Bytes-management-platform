import {useEffect, useState, type Dispatch, type SetStateAction} from "react";
import Input from "../../../common/components/Input";
import type FloorplansPopUp from "../../../types/floorPlans/floorplantsPopUp";
import type ISchedule from "../../../types/schedules/ISchedule";
import type {IParticipant} from "../../../types/compontents/IParticipant";

interface IParticipantpopUpFloorplans {
    currentScedule: ISchedule;
    setCurrentScedule: Dispatch<SetStateAction<ISchedule>>;
    currentParticipant: IParticipant;
    isInfo: boolean;
}

const scheduleFieldsByDay = [
    ["monMorning", "monEvening"],
    ["thuesMorning", "thuesEvening"],
    ["wedMorning", "wedEvening"],
    ["thursMorning", "thursEvening"],
    ["friMorning", "friEvening"],
] as const;

export default function ParticipantpopUpFloorplans({
    currentWorkplace,
    setCurrentWorkplace,
    popupPropsExtra,
    currentDay,
    workplaces,
    setWorkplaces,
    participants,
}: FloorplansPopUp<IParticipantpopUpFloorplans>) {
    const [currentParticipants, setCurrentParticipants] = useState<[IParticipant, IParticipant]>();

    useEffect(() => {
        setCurrentParticipants([
            participants.find(p => `${p.firstname} ${p.lastname}` === currentWorkplace.timeslots[currentDay].Ochtend),
            participants.find(p => `${p.firstname} ${p.lastname}` === currentWorkplace.timeslots[currentDay].Middag),
        ]);
    }, [participants, currentDay]);

    const scheduleFields = currentDay === undefined ? undefined : scheduleFieldsByDay[currentDay];
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

    return (
        <div
            className="px-5 py-5 flex flex-col gap-3 text-sm font-medium text-(--color-darkblue) bg-(--color-white)
                rounded-2xl shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
            <div className="flex flex-row justify-between text-base">
                <span>Plek {currentWorkplace?.name}</span>

                <span className={occupancyStatus.color}>{occupancyStatus.label}</span>
            </div>

            <div className="h-px bg-(--color-black)/5"></div>

            {Object.keys(currentWorkplace.timeslots[currentDay]).map((timeslot, index) => {
                const scheduleField = scheduleFields?.[index];

                return (
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
                            id={`${index}`}
                            type="checkbox"
                            readOnly={
                                (currentParticipants?.[index]?.id !== undefined &&
                                    currentParticipants?.[index]?.id !== popupPropsExtra.currentParticipant.id &&
                                    currentWorkplace.id !== popupPropsExtra.currentScedule[scheduleField]) ||
                                popupPropsExtra.isInfo
                            }
                            label={
                                currentParticipants && currentParticipants[index]
                                    ? `${currentParticipants[index].firstname} ${currentParticipants[index].lastname}`
                                    : ""
                            }
                            labelPos="right"
                            checked={
                                popupPropsExtra?.currentScedule[scheduleField] === currentWorkplace.id ||
                                popupPropsExtra?.currentScedule.participant === currentParticipants?.[index]?.id
                            }
                            onChange={value => {
                                if (!scheduleField || !popupPropsExtra) return;

                                const previousWorkplace = workplaces.find(
                                    wp => wp.id === popupPropsExtra.currentScedule[scheduleField],
                                );

                                popupPropsExtra.setCurrentScedule(schedule => ({
                                    ...schedule,
                                    [scheduleField]: value ? currentWorkplace.id : undefined,
                                }));

                                if (index === 0) {
                                    if (previousWorkplace) previousWorkplace.timeslots[currentDay].Ochtend = "Vrij";
                                    currentWorkplace.timeslots[currentDay].Ochtend = value ? "temp bezet" : "Vrij";
                                } else if (index === 1) {
                                    if (previousWorkplace) previousWorkplace.timeslots[currentDay].Middag = "Vrij";
                                    currentWorkplace.timeslots[currentDay].Middag = value ? "temp bezet" : "Vrij";
                                }

                                const updatedWorkplace = {
                                    ...currentWorkplace,
                                    timeslots: currentWorkplace.timeslots,
                                };

                                const updatedWorkplaces = workplaces.map(workplace =>
                                    workplace.id === updatedWorkplace.id
                                        ? updatedWorkplace
                                        : previousWorkplace && workplace.id === previousWorkplace.id
                                          ? previousWorkplace
                                          : workplace,
                                );

                                setCurrentWorkplace(updatedWorkplace);
                                setWorkplaces(updatedWorkplaces);
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}

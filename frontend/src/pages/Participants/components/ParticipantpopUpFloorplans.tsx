import {useState} from "react";
import Input from "../../../common/components/Input";
import type {FloorplansPopUpAddParticipant} from "../../../types/floorPlans/floorplantsPopUp";

export default function ParticipantpopUpFloorplans({currentWorkplace}: FloorplansPopUpAddParticipant) {
    const [occupation, setOccupation] = useState<[boolean, boolean]>([false, false]);

    const occupancyStatuses = [
        {label: "Vrij", color: "text-(--color-green)"},
        {label: "Deels", color: "text-(--color-yellow)"},
        {label: "Bezet", color: "text-(--color-red)"},
    ];
    const occupancyStatus =
        occupancyStatuses[currentWorkplace.timeslots.filter(timeslot => timeslot.occupancy !== "Vrij").length];

    return (
        <div
            className="px-5 py-5 flex flex-col gap-3 text-sm font-medium text-(--color-darkblue) bg-(--color-white)
                rounded-2xl shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
            <div className="flex flex-row justify-between text-base">
                <span>Plek {currentWorkplace?.name}</span>

                <span className={occupancyStatus.color}>{occupancyStatus.label}</span>
            </div>

            <div className="h-px bg-(--color-black)/5"></div>

            {currentWorkplace.timeslots.map((timeslot, index) => (
                <div key={timeslot.name} className="flex flex-row gap-3 items-center">
                    <span
                        className={`size-2.5 shrink-0 rounded-full
                        ${timeslot.occupancy === "Vrij" ? "bg-(--color-green)" : "bg-(--color-red)"}`}></span>

                    <label
                        htmlFor={`participant-${currentWorkplace.id}-${index}`}
                        className="w-20 text-(--color-darkblue)/50">
                        {timeslot.name}
                    </label>

                    <Input
                        id={`${index}`}
                        type="checkbox"
                        checked={occupation[index]}
                        onChange={value =>
                            setOccupation(index === 0 ? [value, occupation[1]] : [occupation[0], value])
                        }></Input>
                </div>
            ))}
        </div>
    );
}

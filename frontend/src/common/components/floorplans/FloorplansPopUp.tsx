import Input from "../Input";
import drawFloorPlan from "./DrawFloorPlan";
import {type FloorplansPopUpDefault} from "../../../types/floorPlans/floorplantsPopUp";

export default function FloorplansPopUp({
    canvas,
    currentWorkplace,
    participants,
    setCurrentWorkplace,
    currentScale,
    setWorkplaces,
    room,
    workplaces,
    walls,
}: FloorplansPopUpDefault) {
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
                        value={timeslot.occupancy}
                        onChange={value => {
                            const updatedWorkplace = {
                                ...currentWorkplace,
                                timeslots: currentWorkplace.timeslots.map((slot, slotIndex) =>
                                    slotIndex === index ? {...slot, occupancy: value} : slot,
                                ),
                            };
                            const updatedWorkplaces = workplaces.map(workplace =>
                                workplace.id === updatedWorkplace.id ? updatedWorkplace : workplace,
                            );
                            setCurrentWorkplace(updatedWorkplace);
                            setWorkplaces(updatedWorkplaces);
                            currentScale.current = drawFloorPlan(canvas, room, updatedWorkplaces, walls);
                        }}
                        className={`flex-1 min-w-0 ${timeslot.occupancy === "Vrij" ? "text-(--color-darkblue)/50" : ""}`}
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
                }}
                id="notities"
                type="textarea"
                label="Notities"
                labelClassName="font-medium text-(--color-darkblue)"
            />
        </div>
    );
}

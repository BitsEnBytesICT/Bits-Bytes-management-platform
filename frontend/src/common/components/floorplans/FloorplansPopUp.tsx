import type IFloorplansPopUp from "../../../types/floorPlans/floorplantsPopUp";
import Input from "../Input";

export default function FloorplansPopUp({
    currentWorkplace,
    participants,
    setCurrentWorkplace,
    setWorkplaces,
    workplaces,
    currentDay,
}: IFloorplansPopUp<unknown>) {
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
                        onChange={value => {
                            if (index === 0) currentWorkplace.timeslots[currentDay].Ochtend = value;
                            else if (index === 1) currentWorkplace.timeslots[currentDay].Middag = value;

                            const updatedWorkplace = {
                                ...currentWorkplace,
                                timeslots: currentWorkplace.timeslots,
                            };

                            const updatedWorkplaces = workplaces.map(workplace =>
                                workplace.id === updatedWorkplace.id ? updatedWorkplace : workplace,
                            );

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
                }}
                id="notities"
                type="textarea"
                label="Notities"
                labelClassName="font-medium text-(--color-darkblue)"
            />
        </div>
    );
}

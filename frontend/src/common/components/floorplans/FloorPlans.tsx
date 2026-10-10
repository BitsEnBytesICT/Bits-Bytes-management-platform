import {useEffect, useRef, useState} from "react";

import SmallButton from "../SmallButton";
import Tabs from "../Tabs";

import {ArrowBox, IconProduct} from "../../../assets";
import drawFloorPlan from "./DrawFloorPlan";
import type {IWall} from "../../../types/floorPlans/IWall";
import type {IWorkplace, WorkplaceWithOccupancy} from "../../../types/floorPlans/IWorkplace";
import type IFloorPlans from "../../../types/compontents/IFloorPlans";
import {scheduleFieldsByDay} from "../../../types/schedules/ISchedule";
import FloorplansService from "./floorplans.service";

export default function FloorPlans<T>({
    rooms,
    participants,
    setParticipants,
    PopUpContent,
    dayButtons,
    stacked,
    height,
    popupPropsExtra,
    currentEditedScedule,
    workplaces,
}: IFloorPlans<T>) {
    const [active, setActive] = useState(0);
    const [currentDay, setCurrentDay] = useState(0);
    const [drawn, setDrawn] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);
    const [popupPosition, setPopupPosition] = useState({left: 0, top: 0});
    const [arrowSide, setArrowSide] = useState<keyof typeof arrowClassName>("left");
    const [arrowOffset, setArrowOffset] = useState(0);
    const [currentWorkplace, setCurrentWorkplace] = useState<WorkplaceWithOccupancy>();
    const [workplacesWithOccupancy, setWorkplacesWithOccupancy] = useState<WorkplaceWithOccupancy[]>([]);
    const [walls, setWalls] = useState<IWall[]>([]);
    const canvas = useRef<HTMLCanvasElement>(null);
    const popup = useRef<HTMLDivElement>(null);
    const currentScale = useRef<number | undefined>(undefined);

    const popupWidth = 300;

    const arrowClassName = {
        left: "-left-1.75 top-1/2 -translate-y-1/2 -rotate-90",
        right: "-right-1.75 top-1/2 -translate-y-1/2 rotate-90",
        top: "-top-1",
        bottom: "-bottom-1 rotate-180",
    };

    const floorplansService: FloorplansService = new FloorplansService();

    useEffect(() => {
        if (!rooms[active]) return;

        if (workplaces?.length > 0) setOccupancy(workplaces.filter(wp => wp.RoomID === rooms[active].id));
        else floorplansService.getWorkplaces(rooms[active].id).then(setOccupancy);
        floorplansService.getWalls(rooms[active].id).then(setWalls);
    }, [rooms, active]);

    useEffect(() => {
        const day = new Date().getDay() - 1;
        if (day > 4 || day < 0) setCurrentDay(0);
        else setCurrentDay(day);
    }, []);

    useEffect(() => {
        const element = canvas.current;
        if (!element) return;
        if (!rooms[active]?.scale) return;

        let timer: ReturnType<typeof setTimeout>;

        const observer = new ResizeObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                currentScale.current = drawFloorPlan(
                    canvas,
                    rooms[active],
                    currentDay,
                    workplacesWithOccupancy,
                    walls,
                    currentEditedScedule,
                );
                setDrawn(true);
            }, 200);
        });

        observer.observe(element);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [rooms, workplacesWithOccupancy, walls, currentDay, currentEditedScedule]);

    function setOccupancy(workplaces: IWorkplace[]) {
        const workplacesWithOccupancy: WorkplaceWithOccupancy[] = workplaces.map(wp => ({
            ...wp,
            timeslots: [0, 1, 2, 3, 4].map(() => ({Ochtend: "Vrij", Middag: "Vrij"})),
        }));

        const now = Date.now();

        for (const participant of participants) {
            if (!participant.schedules) continue;
            for (const schedule of participant.schedules) {
                if ((schedule.endDate && schedule.endDate.getTime() < now) || schedule.startDate.getTime() > now)
                    continue;

                for (const [field, dayIndex, period] of scheduleFieldsByDay) {
                    const workplaceId = schedule[field];

                    if (workplaceId === undefined || workplaceId === null) continue;

                    const workplace = workplacesWithOccupancy.find(wp => wp.id === workplaceId);

                    if (!workplace) continue;

                    workplace.timeslots[dayIndex][period] = `${participant.firstname} ${participant.lastname}`;
                }
            }
        }

        setWorkplacesWithOccupancy(workplacesWithOccupancy);
    }

    function onMouseHover(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const widthOffset = (canvas.width - rooms[active].width / currentScale.current) / 2;
        const heightOffset = (canvas.height - rooms[active].height / currentScale.current) / 2;
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        if (!rooms[active]) return;

        for (const workplace of workplacesWithOccupancy) {
            const left = workplace.xpos / currentScale.current + widthOffset;
            const top = workplace.ypos / currentScale.current + heightOffset;
            const width = (workplace.rotation === 90 ? 1600 : 800) / currentScale.current;
            const height = (workplace.rotation === 90 ? 800 : 1600) / currentScale.current;
            const popupHeight = popup.current?.clientHeight ?? 200;

            if (!currentScale.current || x < left || x > left + width || y < top || y > top + height) continue;

            canvas.style.cursor = "pointer";
            setCurrentWorkplace(workplace);

            if (left + width + popupWidth < canvas.width) {
                setPopupPosition({left: left + width, top: top + height / 2 - popupHeight / 2});
                setArrowSide("left");
            } else if (left - popupWidth > 0) {
                setPopupPosition({left: left - popupWidth, top: top + height / 2 - popupHeight / 2});
                setArrowSide("right");
            } else {
                const popupLeft = Math.min(Math.max(left + width / 2 - popupWidth / 2, 0), canvas.width - popupWidth);
                const underneath = top + height + popupHeight < canvas.height;

                setPopupPosition({left: popupLeft, top: underneath ? top + height : top - popupHeight});
                setArrowSide(underneath ? "top" : "bottom");
                setArrowOffset(Math.min(Math.max(left + width / 2 - popupLeft - 8, 20), popupWidth - 36));
            }

            setShowPopUp(true);
            return;
        }

        canvas.style.cursor = "default";

        if (
            !popup.current ||
            x < popupPosition.left ||
            x > popupPosition.left + popup.current.clientWidth ||
            y < popupPosition.top ||
            y > popupPosition.top + popup.current.clientHeight
        )
            setShowPopUp(false);
    }

    const roomButtons = (
        <div className="flex flex-row flex-wrap gap-6">
            {rooms &&
                rooms.map((room, i) => (
                    <SmallButton
                        key={room.name}
                        icon={<img className="select-none [-webkit-user-drag:none]" src={IconProduct} />}
                        label={room.name}
                        active={active === i}
                        onClick={() => setActive(i)}
                    />
                ))}
        </div>
    );

    const dayTabs = (dayButtons || dayButtons === undefined) && (
        <Tabs
            tabs={["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"]}
            active={currentDay}
            onChange={setCurrentDay}
            classNameExtra={stacked ? "grow justify-between" : undefined}
        />
    );

    return (
        <div className="flex flex-col gap-4 animate-[fade-in_0.3s_ease-in-out]">
            <div className="flex justify-between flex-wrap gap-y-3">
                {!stacked && roomButtons}
                {dayTabs}
            </div>

            <div className="relative">
                <canvas
                    ref={canvas}
                    onMouseMove={e => onMouseHover(e)}
                    onMouseLeave={e => {
                        if (e.relatedTarget instanceof Node && popup.current?.contains(e.relatedTarget)) return;
                        setShowPopUp(false);
                    }}
                    className={`p-1 flex items-center justify-center ${height ?? "h-120"} w-full bg-(--color-white)
                        rounded-lg transition-opacity duration-300 ease-in-out ${drawn ? "opacity-100" : "opacity-0"}
                        shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]`}></canvas>

                {PopUpContent && showPopUp && currentWorkplace && rooms[active] && (
                    <div
                        className="p-1 absolute z-50 w-75 animate-[fade-in_0.2s_ease-in-out]"
                        style={popupPosition}
                        ref={popup}
                        onMouseLeave={e => {
                            if (e.relatedTarget instanceof Node && canvas.current?.contains(e.relatedTarget)) return;
                            setShowPopUp(false);
                        }}>
                        <img
                            src={ArrowBox}
                            style={arrowSide === "top" || arrowSide === "bottom" ? {left: arrowOffset} : undefined}
                            className={`absolute z-10 select-none [-webkit-user-drag:none] ${arrowClassName[arrowSide]}`}
                        />

                        {PopUpContent && (
                            <PopUpContent
                                canvas={canvas}
                                currentWorkplace={currentWorkplace}
                                participants={participants}
                                setParticipants={setParticipants}
                                setCurrentWorkplace={setCurrentWorkplace}
                                currentScale={currentScale}
                                setWorkplaces={setWorkplacesWithOccupancy}
                                room={rooms[active]}
                                workplaces={workplacesWithOccupancy}
                                walls={walls}
                                popupPropsExtra={popupPropsExtra}
                                currentDay={currentDay}
                            />
                        )}
                    </div>
                )}
            </div>

            {stacked && roomButtons}
        </div>
    );
}

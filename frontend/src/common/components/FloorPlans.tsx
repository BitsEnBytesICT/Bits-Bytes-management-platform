import {useEffect, useRef, useState} from "react";

import SmallButton from "./SmallButton";
import Tabs from "./Tabs";

import {ArrowBox, IconProduct} from "../../assets";
import drawFloorPlan from "./drawFloorPlan";
import type IFloorPlans from "../../types/compontents/IFloorPlans";
import type {IWall} from "../../types/floorPlans/IWall";
import type {IWorkplace, WorkplaceWithOccupancy} from "../../types/floorPlans/IWorkplace";
import http from "../http";
import type {KeyValuePair} from "../../types/validation/keyvaluePair";
import Input from "./Input";

export default function FloorPlans({rooms, participants, dayButtons}: IFloorPlans) {
    const [active, setActive] = useState(0);
    const [currentDay, setCurrentDay] = useState(0);
    const [drawn, setDrawn] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);
    const [popupPosition, setPopupPosition] = useState({left: 0, top: 0});
    const [arrowSide, setArrowSide] = useState<keyof typeof arrowClassName>("left");
    const [arrowOffset, setArrowOffset] = useState(0);
    const [currentWorkplace, setCurrentWorkplace] = useState<WorkplaceWithOccupancy>();
    const [workplaces, setWorkplaces] = useState<WorkplaceWithOccupancy[]>([]);
    const [walls, setWalls] = useState<IWall[]>([]);
    const [occupancyStatus, setOccupancyStatus] = useState<{label: string; color: string}>();
    const canvas = useRef<HTMLCanvasElement>(null);
    const popup = useRef<HTMLDivElement>(null);
    const currentScale = useRef<number | undefined>(undefined);

    const occupancyStatuses = [
        {label: "Vrij", color: "text-(--color-green)"},
        {label: "Deels", color: "text-(--color-yellow)"},
        {label: "Bezet", color: "text-(--color-red)"},
    ];

    const popupWidth = 260;

    const arrowClassName = {
        left: "-left-1.75 top-1/2 -translate-y-1/2 -rotate-90",
        right: "-right-1.75 top-1/2 -translate-y-1/2 rotate-90",
        top: "-top-1",
        bottom: "-bottom-1 rotate-180",
    };

    useEffect(() => {
        if (!rooms[active]) return;
        getWorkplaces().then(
            (
                workplaces, //tijdelijk todat de data uit de db gehaald kan worden
            ) =>
                setWorkplaces(
                    workplaces.map(wp => ({
                        ...wp,
                        timeslots: [
                            {name: "Ochtend", occupancy: "Vrij"},
                            {name: "Middag", occupancy: "Vrij"},
                        ],
                    })),
                ),
        );
        getWalls().then(setWalls);
    }, [rooms, active]);

    useEffect(() => {
        const day = new Date().getDay() - 1;
        if (day > 4) setCurrentDay(0);
        else setCurrentDay(day);
    }, []);

    useEffect(() => {
        const element = canvas.current;
        if (!element) return;

        let timer: ReturnType<typeof setTimeout>;

        const observer = new ResizeObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                currentScale.current = drawFloorPlan(canvas, rooms[active], workplaces, walls);
                setDrawn(true);
            }, 200);
        });

        observer.observe(element);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [rooms, workplaces, walls]);

    async function getWorkplaces(): Promise<IWorkplace[]> {
        let workplacesData: IWorkplace[] = [];

        await http("/api/workplaces", "POST", {
            where: [["RoomID", rooms[active].id]] satisfies KeyValuePair<IWorkplace>[],
        }).then(async res => {
            if (res.status === 200) workplacesData = await res.json();
        });

        return workplacesData;
    }

    async function getWalls(): Promise<IWall[]> {
        let wallsData: IWall[] = [];

        await http("/api/walls", "POST", {where: [["RoomID", rooms[active].id]] satisfies KeyValuePair<IWall>[]}).then(
            async res => {
                if (res.status === 200) wallsData = await res.json();
            },
        );

        return wallsData;
    }

    function onMouseHover(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const widthOffset = (canvas.width - rooms[active].width / currentScale.current) / 2;
        const heightOffset = (canvas.height - rooms[active].height / currentScale.current) / 2;
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        if (!rooms[active]) return;

        for (const workplace of workplaces) {
            const left = workplace.xpos / currentScale.current + widthOffset;
            const top = workplace.ypos / currentScale.current + heightOffset;
            const width = (workplace.rotation === 90 ? 1600 : 800) / currentScale.current;
            const height = (workplace.rotation === 90 ? 800 : 1600) / currentScale.current;
            const popupHeight = popup.current?.clientHeight ?? 200;

            if (x < left || x > left + width || y < top || y > top + height) continue;

            canvas.style.cursor = "pointer";
            setCurrentWorkplace(workplace);

            setOccupancyStatus(
                occupancyStatuses[workplace.timeslots.filter(timeslot => timeslot.occupancy !== "Vrij").length],
            );

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

    return (
        <div className="flex flex-col gap-4 animate-[fade-in_0.3s_ease-in-out]">
            <div className="flex justify-between">
                <div className="flex flex-row gap-6">
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

                {(dayButtons || dayButtons === undefined) && (
                    <Tabs
                        tabs={["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag"]}
                        active={currentDay}
                        onChange={setCurrentDay}
                    />
                )}
            </div>

            <div className="relative">
                <canvas
                    ref={canvas}
                    onMouseMove={e => onMouseHover(e)}
                    onMouseLeave={e => {
                        if (e.relatedTarget instanceof Node && popup.current?.contains(e.relatedTarget)) return;
                        setShowPopUp(false);
                    }}
                    className={`p-1 flex items-center justify-center h-120 w-full bg-(--color-white) rounded-lg
                        transition-opacity duration-300 ease-in-out ${drawn ? "opacity-100" : "opacity-0"}
                        shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]`}></canvas>

                {showPopUp && (
                    <div
                        className="p-1 absolute z-50 w-65 animate-[fade-in_0.2s_ease-in-out]"
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

                        <div
                            className="px-5 py-4 flex flex-col gap-2 text-sm font-medium text-(--color-darkblue)
                                bg-(--color-white) rounded-2xl
                                shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
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
                                            currentWorkplace.timeslots[index].occupancy = value;
                                            setCurrentWorkplace({...currentWorkplace});
                                            setOccupancyStatus(
                                                occupancyStatuses[
                                                    currentWorkplace.timeslots.filter(
                                                        timeslot => timeslot.occupancy !== "Vrij",
                                                    ).length
                                                ],
                                            );
                                            currentScale.current = drawFloorPlan(
                                                canvas,
                                                rooms[active],
                                                workplaces,
                                                walls,
                                            );
                                        }}
                                        className={timeslot.occupancy === "Vrij" ? "text-(--color-darkblue)/50" : ""}
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
                                id="omschrijving"
                                type="textarea"
                                label="Omschrijving"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

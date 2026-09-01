import {useEffect, useRef, useState} from "react";

import SmallButton from "./SmallButton";

import {IconClose, IconProduct} from "../../assets";
import drawFloorPlan from "./drawFloorPlan";
import type IFloorPlans from "../../types/compontents/IFloorPlans";
import type {IWall} from "../../types/floorPlans/IWall";
import type {IWorkplace} from "../../types/floorPlans/IWorkplace";
import http from "../http";
import type {KeyValuePair} from "../../types/validation/keyvaluePair";

//const floorPlans = [{label: "Server ruimte"}, {label: "Gymzaal"}, {label: "Stille ruimte"}];

export default function FloorPlans({rooms}: IFloorPlans) {
    const [active, setActive] = useState(0);
    const [showPopUp, setShowPopUp] = useState(false);
    const [popupPosition, setPopupPosition] = useState({left: 0, top: 0});
    const [currentWorkPlace, setCurrentWorkPlace] = useState<IWorkplace>();
    const [workplaces, setWorkplaces] = useState<IWorkplace[]>([]);
    const canvas = useRef<HTMLCanvasElement>(null);
    const popup = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getWorkplaces().then(workplaces => {
            setWorkplaces(workplaces);
            getWalls().then(walls => {
                drawFloorPlan(canvas, rooms[active], workplaces, walls);
            });
        });
    }, [rooms, active]);

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
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        let popupPos = {
            x: 0,
            y: 0,
        };
        for (const workplace of workplaces) {
            if (
                (!workplace.rotation &&
                    x >= workplace.xpos / rooms[active].scale &&
                    x <= (workplace.xpos + 800) / rooms[active].scale &&
                    y >= workplace.ypos / rooms[active].scale &&
                    y <= (workplace.ypos + 1600) / rooms[active].scale) ||
                (workplace.rotation == 90 &&
                    x >= workplace.xpos / rooms[active].scale &&
                    x <= (workplace.xpos + 1600) / rooms[active].scale &&
                    y >= workplace.ypos / rooms[active].scale &&
                    y <= (workplace.ypos + 800) / rooms[active].scale)
            ) {
                canvas.style.cursor = "pointer";
                setCurrentWorkPlace(workplace);
                if (workplace.xpos / rooms[active].scale + 300 < canvas.width) {
                    popupPos.x = (workplace.xpos + 800) / rooms[active].scale;
                    popupPos.y = workplace.ypos / rooms[active].scale;
                } else {
                    popupPos.x = workplace.xpos / rooms[active].scale - 250;
                    popupPos.y = workplace.ypos / rooms[active].scale;
                }
                setPopupPosition({
                    left: popupPos.x,
                    top: popupPos.y,
                });
                setShowPopUp(true);
                return;
            }
        }
        canvas.style.cursor = "default";

        if (
            !popup.current ||
            !showPopUp ||
            x < popupPos.x ||
            x > popupPos.x + popup.current.clientWidth ||
            y < popupPos.y ||
            y > popupPos.y + popup.current.clientHeight
        )
            setShowPopUp(false);
    }

    return (
        <div className="flex flex-col gap-4 relative">
            <canvas
                ref={canvas}
                onMouseMove={e => onMouseHover(e)}
                onMouseLeave={e => {
                    if (e.relatedTarget instanceof Node && popup.current?.contains(e.relatedTarget)) return;
                    setShowPopUp(false);
                }}
                className="p-1 flex items-center justify-center max-h-120 max-w-full bg-(--color-white) rounded-lg
                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]"></canvas>

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
                {!rooms && <>geen ruimtes gemaakt</>}
            </div>

            {showPopUp && (
                <div
                    className="absolute flex items-center justify-center z-50 w-[250px] min-h-50 p-1"
                    style={popupPosition}
                    ref={popup}
                    onMouseLeave={e => {
                        if (e.relatedTarget instanceof Node && canvas.current?.contains(e.relatedTarget)) return;
                        setShowPopUp(false);
                    }}>
                    <div
                        className="relative px-10 py-8 flex flex-col gap-6 justify-between w-full max-w-100 h-full
                            bg-white rounded-2xl
                            shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                        <img
                            src={IconClose}
                            onClick={() => setShowPopUp(false)}
                            className="absolute top-9.5 right-10 cursor-pointer select-none [-webkit-user-drag:none]"
                        />

                        <div className="text-[20px] font-extrabold text-center text-(--color-darkblue)">info</div>

                        <div className="flex flex-col text-center text-(--color-darkblue)">
                            <span>Pleknummer: {currentWorkPlace.name}</span>
                            <span className="my-5 text-[18px]">Bezetting</span>
                            <span>ochtend</span>
                            <select>
                                <option value="deelnemer 1">deelnemer 1</option>
                                <option value="leeg">leeg</option>
                            </select>
                            <span className="mt-2.5">middag</span>
                            <select>
                                <option value="deelnemer 2">deelnemer 2</option>
                                <option value="leeg">leeg</option>
                            </select>
                            <span className="mt-2.5">{currentWorkPlace.extraInfo}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

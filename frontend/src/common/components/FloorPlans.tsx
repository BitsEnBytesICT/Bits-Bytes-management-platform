import {useEffect, useRef, useState} from "react";

import SmallButton from "./SmallButton";

import {IconClose, IconProduct} from "../../assets";
import drawFloorPlan from "./drawFloorPlan";
import type {IRoom} from "../../types/floorPlans/IRoom";
import type {IWall} from "../../types/floorPlans/IWall";
import type {IWorkplace} from "../../types/floorPlans/IWorkplace";

//const floorPlans = [{label: "Server ruimte"}, {label: "Gymzaal"}, {label: "Stille ruimte"}];

export default function FloorPlans() {
    const [active, setActive] = useState(0);
    const [showPopUp, setShowPopUp] = useState(false);
    const [popupPosition, setPopupPosition] = useState({left: 0, top: 0});
    const [currentWorkPlace, setCurrentWorkPlace] = useState<IWorkplace>();
    const canvas = useRef<HTMLCanvasElement>(null);
    const popup = useRef<HTMLDivElement>(null);

    const rooms: IRoom[] = [
        {
            name: "Gymzaal",
            width: 21000,
            height: 7000,
            scale: 18,
        },
    ];

    const walls: IWall[] = [
        {
            xpos: 10,
            ypos: 3000,
            RoomID: 0,
            height: 5000,
        },
        {
            xpos: 5000,
            ypos: 10,
            RoomID: 0,
            height: 7000,
            rotation: 90,
        },
    ];

    const workplaces: IWorkplace[] = [
        {
            xpos: 8000,
            ypos: 200,
            height: 50,
            RoomID: 0,
            name: "c2",
            extraInfo: "test info",
        },
        {
            xpos: 19000,
            ypos: 5200,
            height: 50,
            RoomID: 0,
            name: "c3",
            extraInfo: "test info 2",
        },
    ];

    useEffect(() => {
        drawFloorPlan(canvas, rooms[0], workplaces, walls);
    }, [canvas]);

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
                x >= workplace.xpos / rooms[0].scale &&
                x <= (workplace.xpos + 800) / rooms[0].scale &&
                y >= workplace.ypos / rooms[0].scale &&
                y <= (workplace.ypos + 1600) / rooms[0].scale
            ) {
                canvas.style.cursor = "pointer";
                setCurrentWorkPlace(workplace);
                if (x + 250 < canvas.width) {
                    popupPos.x = (workplace.xpos + 800) / rooms[0].scale;
                    popupPos.y = workplace.ypos / rooms[0].scale;
                } else {
                    popupPos.x = workplace.xpos / rooms[0].scale - 250;
                    popupPos.y = workplace.ypos / rooms[0].scale;
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
                className="p-1 flex items-center justify-center max-h-100 max-w-full bg-(--color-white) rounded-lg
                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]"></canvas>

            <div className="flex flex-row gap-6">
                {rooms.map((plan, i) => (
                    <SmallButton
                        key={plan.name}
                        icon={<img className="select-none [-webkit-user-drag:none]" src={IconProduct} />}
                        label={plan.name}
                        active={active === i}
                        onClick={() => setActive(i)}
                    />
                ))}
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

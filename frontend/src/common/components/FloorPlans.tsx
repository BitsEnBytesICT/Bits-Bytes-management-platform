import {useEffect, useRef, useState} from "react";

import SmallButton from "./SmallButton";

import {IconProduct} from "../../assets";
import drawFloorPlan from "./drawFloorPlan";
import type {IRoom} from "../../types/floorPlans/IRoom";
import type {IWorkplace} from "../../types/floorPlans/IWorkplace";
import type {IWall} from "../../types/floorPlans/IWall";

const floorPlans = [{label: "Server ruimte"}, {label: "Gymzaal"}, {label: "Stille ruimte"}];

export default function FloorPlans() {
    const [active, setActive] = useState(0);
    const [showPopUp, setShowPopUp] = useState(false);
    const [currentWorkPlace, setCurrentWorkPlace] = useState<IWorkplace>();
    const canvas = useRef(null);
    const popupRef = useRef(null);

    const room: IRoom = {
        name: "Gymzaal",
        width: 21000,
        height: 7000,
        scale: 20,
    };

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
        },
    ];

    const workplaces: IWorkplace[] = [
        {
            xpos: 8000,
            ypos: 200,
            height: 50,
            RoomID: 0,
            name: "test",
            extraInfo: "test info",
        },
    ];

    useEffect(() => {
        drawFloorPlan(canvas, room, workplaces, walls);
    }, [canvas]);

    function onMouseHover(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        console.log(`x: ${x} y: ${y}`);
        for (const workplace of workplaces) {
            if (
                x >= workplace.xpos / room.scale &&
                x <= (workplace.xpos + 800) / room.scale &&
                y >= workplace.ypos / room.scale &&
                y <= (workplace.ypos + 1600) / room.scale
            ) {
                canvas.style.cursor = "pointer";
                setCurrentWorkPlace(workplace);
                setShowPopUp(true);
                popupRef.current.style.left = `${workplace.xpos / room.scale}px`;
                popupRef.current.style.top = `${workplace.ypos / room.scale}px`;
                return;
            }
        }
        canvas.style.cursor = "default";
        setShowPopUp(false);
        setCurrentWorkPlace(null);
    }

    function renderPopUp() {
        return (
            <div className="absolute" ref={popupRef}>
                {currentWorkPlace.extraInfo}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 relative">
            <canvas
                ref={canvas}
                onMouseMove={e => onMouseHover(e)}
                className="p-1 flex items-center justify-center h-100 bg-(--color-white) rounded-lg
                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]"></canvas>

            <div className="flex flex-row gap-6">
                {floorPlans.map((plan, i) => (
                    <SmallButton
                        key={plan.label}
                        icon={<img className="select-none [-webkit-user-drag:none]" src={IconProduct} />}
                        label={plan.label}
                        active={active === i}
                        onClick={() => setActive(i)}
                    />
                ))}
            </div>

            {showPopUp && renderPopUp()}
        </div>
    );
}

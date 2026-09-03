import type {RefObject} from "react";
import type {IRoom} from "../../types/floorPlans/IRoom";
import type {IWall} from "../../types/floorPlans/IWall";
import type {IWorkplace} from "../../types/floorPlans/IWorkplace";

export default function drawFloorPlan(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    room: IRoom,
    workplaces: IWorkplace[],
    walls?: IWall[],
): void {
    const canvas = canvasRef.current;

    if (!canvas || !room) return;

    canvas.style.width = `${room.width / room.scale + 2}px`;
    canvas.style.height = `${room.height / room.scale + 2}px`;

    if (canvas.height !== canvas.clientHeight) canvas.height = canvas.clientHeight;

    if (canvas.width !== canvas.clientWidth) canvas.width = canvas.clientWidth;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 1;
    context.strokeStyle = "black";
    context.font = "16px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.beginPath();
    context.rect(context.lineWidth, context.lineWidth, room.width / room.scale, room.height / room.scale);
    context.stroke();
    if (walls) {
        walls.forEach(wall => {
            if (!wall.rotation)
                context.rect(wall.xpos / room.scale, wall.ypos / room.scale, wall.height / room.scale, 5);
            else if (wall.rotation === 90)
                context.rect(wall.xpos / room.scale, wall.ypos / room.scale, 5, wall.height / room.scale);
            context.stroke();
        });
    }

    workplaces.forEach(workplace => {
        if (!workplace.rotation) {
            context.rect(workplace.xpos / room.scale, workplace.ypos / room.scale, 800 / room.scale, 1600 / room.scale);
            context.fillText(workplace.name, (workplace.xpos + 400) / room.scale, (workplace.ypos + 800) / room.scale);
        } else if (workplace.rotation === 90) {
            context.rect(workplace.xpos / room.scale, workplace.ypos / room.scale, 1600 / room.scale, 800 / room.scale);
            context.fillText(workplace.name, (workplace.xpos + 800) / room.scale, (workplace.ypos + 400) / room.scale);
        }
        context.stroke();
    });
}

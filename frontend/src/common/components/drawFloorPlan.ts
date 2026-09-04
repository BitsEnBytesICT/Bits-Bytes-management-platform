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

    let currentScale = room.scale;

    canvas.style.width = `${room.width / room.scale + 2}px`;
    canvas.style.height = `${room.height / room.scale + 2}px`;

    if (canvas.height !== canvas.clientHeight) canvas.height = canvas.clientHeight;

    if (canvas.width !== canvas.clientWidth) canvas.width = canvas.clientWidth;

    if (room.width / room.scale > canvas.width - 2) currentScale = Math.ceil(room.width / (canvas.width - 2));

    const context = canvas.getContext("2d");

    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 1;
    context.strokeStyle = "black";
    context.font = "16px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.beginPath();
    context.roundRect(context.lineWidth, context.lineWidth, room.width / currentScale, room.height / currentScale, 6);
    context.stroke();
    if (walls) {
        walls.forEach(wall => {
            if (!wall.rotation)
                context.rect(wall.xpos / currentScale, wall.ypos / currentScale, wall.height / currentScale, 5);
            else if (wall.rotation === 90)
                context.rect(wall.xpos / currentScale, wall.ypos / currentScale, 5, wall.height / currentScale);
            context.stroke();
        });
    }

    workplaces.forEach(workplace => {
        if (!workplace.rotation) {
            context.roundRect(
                workplace.xpos / currentScale,
                workplace.ypos / currentScale,
                800 / currentScale,
                1600 / currentScale,
                6,
            );
            context.fillText(
                workplace.name,
                (workplace.xpos + 400) / currentScale,
                (workplace.ypos + 800) / currentScale,
            );
        } else if (workplace.rotation === 90) {
            context.roundRect(
                workplace.xpos / currentScale,
                workplace.ypos / currentScale,
                1600 / currentScale,
                800 / currentScale,
                6,
            );
            context.fillText(
                workplace.name,
                (workplace.xpos + 800) / currentScale,
                (workplace.ypos + 400) / currentScale,
            );
        }
        context.stroke();
    });
}

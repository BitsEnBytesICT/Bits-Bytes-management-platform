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

    if (!canvas) return;

    if (canvas.height !== canvas.clientHeight) canvas.height = canvas.clientHeight;

    if (canvas.width !== canvas.clientWidth) canvas.width = canvas.clientWidth;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 1;
    context.strokeStyle = "black";

    context.beginPath();
    context.rect(context.lineWidth, context.lineWidth, room.width / room.scale, room.height / room.scale);
    context.stroke();
    if (walls) {
        context.rect(walls[0].xpos / room.scale, walls[0].ypos / room.scale, walls[0].height / room.scale, 5);
        context.rect(walls[1].xpos / room.scale, walls[1].ypos / room.scale, 5, walls[1].height / room.scale);
        // walls.forEach(wall => {
        //     context.rect(wall.xpos / room.scale, wall.ypos / room.scale, wall.height / room.scale, 5);
        //     context.stroke();
        // });
    }

    workplaces.forEach(workplace => {
        context.rect(workplace.xpos / room.scale, workplace.ypos / room.scale, 800 / room.scale, 1600 / room.scale);
        context.stroke();
    });
}

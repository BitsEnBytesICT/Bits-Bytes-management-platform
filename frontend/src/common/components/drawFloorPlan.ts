import type {RefObject} from "react";
import type {IRoom} from "../../types/floorPlans/IRoom";
import type {IWall} from "../../types/floorPlans/IWall";
import type {WorkplaceWithOccupancy} from "../../types/floorPlans/IWorkplace";

export default function drawFloorPlan(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    room: IRoom,
    workplaces: WorkplaceWithOccupancy[],
    walls?: IWall[],
): number {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!canvas || !room || !context) return room.scale;

    let currentScale = room.scale;

    //canvas.style.width = `${room.width / room.scale + 2}px`;
    //canvas.style.height = `${room.height / room.scale + 2}px`;

    if (canvas.height !== canvas.clientHeight) canvas.height = canvas.clientHeight;

    if (canvas.width !== canvas.clientWidth) canvas.width = canvas.clientWidth;

    if (room.width / room.scale > canvas.width - 2) currentScale = Math.ceil(room.width / (canvas.width - 2));

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
        const rotated = workplace.rotation === 90;
        const width = rotated ? 1600 : 800;
        const height = rotated ? 800 : 1600;

        context.beginPath();
        context.roundRect(
            workplace.xpos / currentScale,
            workplace.ypos / currentScale,
            width / currentScale,
            height / currentScale,
            6,
        );

        switch (workplace.timeslots.filter(timeslot => timeslot.occupancy !== "Vrij").length) {
            case 1:
                const x = workplace.xpos / currentScale;
                const y = workplace.ypos / currentScale;
                let gradient: CanvasGradient;
                if (workplace.rotation === 90)
                    gradient = context.createLinearGradient(x, y, x + width / currentScale, y);
                else gradient = context.createLinearGradient(x, y, x, y + height / currentScale);

                if (workplace.timeslots[0].occupancy !== "Vrij") {
                    gradient.addColorStop(0, "#ffd641");
                    gradient.addColorStop(0.4, "#ffd641");
                    gradient.addColorStop(0.6, "#60f376");
                    gradient.addColorStop(1, "#60f376");
                } else {
                    gradient.addColorStop(0, "#60f376");
                    gradient.addColorStop(0.4, "#60f376");
                    gradient.addColorStop(0.6, "#ffd641");
                    gradient.addColorStop(1, "#ffd641");
                }
                context.fillStyle = gradient;
                break;
            case 2:
                context.fillStyle = "#ff6b6b";
                break;
            case 0:
            default:
                context.fillStyle = "#60f376";
                break;
        }

        context.fill();
        context.stroke();

        context.fillStyle = "#000000";
        context.fillText(
            workplace.name,
            (workplace.xpos + width / 2) / currentScale,
            (workplace.ypos + height / 2) / currentScale,
        );
    });

    return currentScale;
}

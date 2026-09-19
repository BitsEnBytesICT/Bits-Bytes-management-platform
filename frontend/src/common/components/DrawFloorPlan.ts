import type {RefObject} from "react";
import type {IRoom} from "../../types/floorPlans/IRoom";
import type {IWall} from "../../types/floorPlans/IWall";
import type {WorkplaceWithOccupancy} from "../../types/floorPlans/IWorkplace";

function cssColor(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function withOpacity(hex: string, opacity: number): string {
    return `${hex}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")}`;
}

export default function DrawFloorPlan(
    canvasRef: RefObject<HTMLCanvasElement | null>,
    room: IRoom,
    workplaces: WorkplaceWithOccupancy[],
    walls?: IWall[],
): number {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!canvas || !room || !context) return room.scale;

    const colors = {
        darkblue: cssColor("--color-darkblue"),
        black: "#000000",
        green: cssColor("--color-green"),
        yellow: cssColor("--color-yellow"),
        red: cssColor("--color-red"),
    };

    const fillOpacity = 0.35;
    const wallThickness = 2.5;

    let currentScale = room.scale;

    if (canvas.height !== canvas.clientHeight) canvas.height = canvas.clientHeight;

    if (canvas.width !== canvas.clientWidth) canvas.width = canvas.clientWidth;

    if (room.width / room.scale > canvas.width - 2 || room.height / room.scale > canvas.height - 2) {
        const widthScale = Math.ceil(room.width / (canvas.width - 2));
        const heightScale = Math.ceil(room.height / (canvas.height - 2));
        currentScale = Math.max(widthScale, heightScale);
    }

    const widthOffset = (canvas.width - room.width / currentScale) / 2;
    const heightOffset = (canvas.height - room.height / currentScale) / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);

    const dotSpacing = 24;
    const dotSize = 4;
    context.fillStyle = withOpacity(colors.black, 0.08);
    for (let dotY = dotSpacing / 2; dotY < canvas.height; dotY += dotSpacing) {
        for (let dotX = dotSpacing / 2; dotX < canvas.width; dotX += dotSpacing) {
            context.beginPath();
            context.roundRect(dotX - dotSize / 2, dotY - dotSize / 2, dotSize, dotSize, 1.5);
            context.fill();
        }
    }

    context.strokeStyle = colors.darkblue;
    context.font = "16px Outfit";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.lineWidth = wallThickness;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.setLineDash([10, 10]);
    context.beginPath();
    context.roundRect(
        wallThickness / 2 + widthOffset,
        wallThickness / 2 + heightOffset,
        room.width / currentScale,
        room.height / currentScale,
        12,
    );
    context.stroke();

    if (walls) {
        walls.forEach(wall => {
            const wallX = wall.xpos / currentScale + widthOffset;
            const wallY = wall.ypos / currentScale + heightOffset;
            const wallLength = wall.height / currentScale;

            context.beginPath();
            context.moveTo(
                !wall.rotation ? wallX : wallX + wallThickness / 2,
                !wall.rotation ? wallY + wallThickness / 2 : wallY,
            );
            context.lineTo(
                !wall.rotation ? wallX + wallLength : wallX + wallThickness / 2,
                !wall.rotation ? wallY + wallThickness / 2 : wallY + wallLength,
            );
            context.stroke();
        });
    }

    context.setLineDash([]);
    context.lineWidth = 1.5;

    workplaces.forEach(workplace => {
        const rotated = workplace.rotation === 90;
        const width = rotated ? 1600 : 800;
        const height = rotated ? 800 : 1600;
        const x = workplace.xpos / currentScale + widthOffset;
        const y = workplace.ypos / currentScale + heightOffset;
        const w = width / currentScale;
        const h = height / currentScale;

        context.beginPath();
        context.roundRect(x, y, w, h, 6);

        switch (workplace.timeslots.filter(timeslot => timeslot.occupancy !== "Vrij").length) {
            case 1: {
                const colorOrder =
                    workplace.timeslots[0].occupancy !== "Vrij"
                        ? [colors.yellow, colors.green]
                        : [colors.green, colors.yellow];

                const skew = Math.min(w, h) * 0.15;
                const margin = context.lineWidth;

                colorOrder.forEach((color, index) => {
                    context.save();
                    context.beginPath();
                    if (index === 0) {
                        context.moveTo(x - margin, y - margin);
                        context.lineTo(rotated ? x + w / 2 + skew : x + w + margin, y - margin);
                        context.lineTo(
                            rotated ? x + w / 2 - skew : x + w + margin,
                            rotated ? y + h + margin : y + h / 2 - skew,
                        );
                        context.lineTo(x - margin, rotated ? y + h + margin : y + h / 2 + skew);
                    } else {
                        context.moveTo(
                            rotated ? x + w / 2 + skew : x - margin,
                            rotated ? y - margin : y + h / 2 + skew,
                        );
                        context.lineTo(x + w + margin, rotated ? y - margin : y + h / 2 - skew);
                        context.lineTo(x + w + margin, y + h + margin);
                        context.lineTo(rotated ? x + w / 2 - skew : x - margin, y + h + margin);
                    }

                    context.closePath();
                    context.clip();

                    context.beginPath();
                    context.roundRect(x, y, w, h, 6);
                    context.fillStyle = withOpacity(color, fillOpacity);
                    context.fill();
                    context.strokeStyle = color;
                    context.stroke();

                    context.restore();
                });
                break;
            }
            case 2:
                context.fillStyle = withOpacity(colors.red, fillOpacity);
                context.fill();
                context.strokeStyle = colors.red;
                context.stroke();
                break;
            case 0:
            default:
                context.fillStyle = withOpacity(colors.green, fillOpacity);
                context.fill();
                context.strokeStyle = colors.green;
                context.stroke();
                break;
        }

        context.fillStyle = colors.black;
        context.fillText(
            workplace.name,
            (workplace.xpos + width / 2) / currentScale + widthOffset,
            (workplace.ypos + height / 2) / currentScale + heightOffset,
        );
    });

    return currentScale;
}

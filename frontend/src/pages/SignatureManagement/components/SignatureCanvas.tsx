import {useEffect, useRef} from "react";
import ConfirmButton from "../../../common/components/ConfirmButton";

export type Point = [number, number];

interface ISignatureCanvas {
    strokes: Point[][];
    onChange: (strokes: Point[][], svg: string) => void;
}

const STROKE_COLOR = "#000000";
const STROKE_WIDTH = 2;

function strokesToSvg(strokes: Point[][], width: number, height: number) {
    let paths = "";

    for (const stroke of strokes) {
        let d = `M ${stroke[0][0]} ${stroke[0][1]}`;
        for (const [x, y] of stroke) {
            d += ` L ${x} ${y}`;
        }
        paths += `<path d="${d}" fill="none" stroke="${STROKE_COLOR}" stroke-width="${STROKE_WIDTH}" />`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${paths}</svg>`;
}

// Strokes are owned by the parent so the drawing survives the canvas being unmounted (e.g. switching PopUp pages)
export default function SignatureCanvas({strokes, onChange}: ISignatureCanvas) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const strokesRef = useRef<Point[][]>([...strokes]);
    const isDrawingRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;

        const ctx = canvas.getContext("2d");
        ctx.scale(dpr, dpr);
        ctx.strokeStyle = STROKE_COLOR;
        ctx.lineWidth = STROKE_WIDTH;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (const stroke of strokesRef.current) {
            ctx.beginPath();
            ctx.moveTo(...stroke[0]);
            for (const point of stroke) {
                ctx.lineTo(...point);
            }
            ctx.stroke();
        }
    }, []);

    function getPoint(e: React.PointerEvent<HTMLCanvasElement>): Point {
        const rect = e.currentTarget.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
    }

    function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
        e.currentTarget.setPointerCapture(e.pointerId);
        isDrawingRef.current = true;

        const point = getPoint(e);
        strokesRef.current.push([point]);

        const ctx = e.currentTarget.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(...point);
        ctx.lineTo(...point);
        ctx.stroke();
    }

    function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
        if (!isDrawingRef.current) return;

        const point = getPoint(e);
        strokesRef.current[strokesRef.current.length - 1].push(point);

        const ctx = e.currentTarget.getContext("2d");
        ctx.lineTo(...point);
        ctx.stroke();
    }

    function onPointerUp() {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;

        const canvas = canvasRef.current;
        onChange([...strokesRef.current], strokesToSvg(strokesRef.current, canvas.clientWidth, canvas.clientHeight));
    }

    function clear() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        strokesRef.current = [];
        onChange([], "");
    }

    return (
        <div className="flex flex-col gap-2">
            <span className="ml-1.5 text-[16px] font-semibold text-(--color-darkblue)">Handtekening *</span>
            <canvas
                ref={canvasRef}
                className="w-full h-64 bg-(--color-offwhite) rounded-xl cursor-crosshair touch-none
                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
            />
            <div className="flex flex-row justify-end">
                <ConfirmButton onClick={clear} variant="secondary">
                    Wissen
                </ConfirmButton>
            </div>
        </div>
    );
}

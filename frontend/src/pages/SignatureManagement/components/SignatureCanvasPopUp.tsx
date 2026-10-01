import {useEffect, useRef, useState} from "react";
import Button from "../../../common/components/Button";
import ConfirmButton from "../../../common/components/ConfirmButton";
import PopUp from "../../../common/components/PopUp";

type Point = [number, number];

interface ISignatureCanvasPopUp {
    onClose: () => void;
    onSave: (svg: string) => void;
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

export default function SignatureCanvasPopUp({onClose, onSave}: ISignatureCanvasPopUp) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const strokesRef = useRef<Point[][]>([]);
    const isDrawingRef = useRef(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [error, setError] = useState<string[]>([]);

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

        setIsEmpty(false);
        setError([]);
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
        isDrawingRef.current = false;
    }

    function clear() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        strokesRef.current = [];
        setIsEmpty(true);
    }

    function save() {
        const canvas = canvasRef.current;
        if (!canvas || isEmpty) {
            setError(["Zet eerst een handtekening"]);
            return;
        }

        onSave(strokesToSvg(strokesRef.current, canvas.clientWidth, canvas.clientHeight));
        onClose();
    }

    return (
        <PopUp
            onClose={onClose}
            title="Handtekening Tekenen"
            child={
                <>
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

                    <div className="flex flex-col h-6">
                        {error &&
                            error.map(e => (
                                <span
                                    key={e}
                                    className="text-[16px] font-semibold text-(--color-red)
                                        animate-[fade-in_0.3s_ease-in-out]">
                                    {e}
                                </span>
                            ))}
                    </div>
                    <div className="mt-auto">
                        <Button onClick={save}>Opslaan</Button>
                    </div>
                </>
            }
        />
    );
}

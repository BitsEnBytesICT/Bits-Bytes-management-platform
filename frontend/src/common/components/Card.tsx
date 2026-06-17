import type Card from "../../types/compontents/Itypes";

export default function Card({title, value}: Card) {
    return (
        <div className="flex w-[14.375rem] flex-col justify-between rounded-lg bg-white pt-[1.25rem] pb-[1.25rem] pl-[1.25rem] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05),inset_5px_0_0_0_var(--color-darkblue)]">
            <div className="font-semibold">{title}</div>

            <div className="self-start text-[20px] font-extrabold">{value}</div>
        </div>
    );
}

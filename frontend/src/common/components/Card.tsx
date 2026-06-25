import type ICard from "../../types/compontents/ICard";

export default function Card({title, value}: ICard) {
    return (
        <div className="flex w-[12.375rem] flex-col justify-between rounded-lg bg-(--color-white) pt-[1.25rem] pb-[1.25rem] pl-[1.25rem] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent),inset_5px_0_0_0_var(--color-darkblue)] min-[1000px]:w-[14.375rem]">
            <div className="text-[16px] font-semibold">{title}</div>

            <div className="self-start text-[20px] font-extrabold">{value}</div>
        </div>
    );
}

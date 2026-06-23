import type IButton from "../../types/compontents/IButton";

export default function Button({icon, label, active, onClick}: IButton) {
    return (
        <button
            onClick={onClick}
            className={`flex cursor-pointer appearance-none flex-row gap-[0.625rem] rounded-lg px-[0.75rem] py-[0.5rem] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)] transition-colors duration-300 ease-in-out hover:bg-(--color-darkblue)/10 ${active ? "bg-(--color-darkblue)/5" : "bg-(--color-white)"}`}>
            {icon}

            <span className="text-sm font-semibold text-(--color-darkblue)">{label}</span>
        </button>
    );
}

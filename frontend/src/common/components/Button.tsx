import type IButton from "../../types/compontents/IButton";

export default function Button({icon, label, active, onClick}: IButton) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-2 flex flex-row gap-2.5 appearance-none rounded-lg shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)] ${active ? "bg-(--color-darkblue)/5" : "bg-(--color-white)"} hover:bg-(--color-darkblue)/10 cursor-pointer transition-colors duration-300 ease-in-out`}>
            {icon}

            <span className="text-sm font-semibold text-(--color-darkblue)">{label}</span>
        </button>
    );
}

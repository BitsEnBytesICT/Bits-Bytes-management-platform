import type ISmallButton from "../../types/compontents/ISmallButton";

export default function SmallButton({icon, label, active, onClick}: ISmallButton) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-2 flex flex-row gap-2.5 ${active ? "bg-(--color-darkblue)/5" : "bg-(--color-white)"}
                appearance-none rounded-lg shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]
                cursor-pointer transition-colors duration-300 ease-in-out hover:bg-(--color-darkblue)/10 `}>
            {icon}

            <div className="text-sm font-semibold text-(--color-darkblue)">{label}</div>
        </button>
    );
}

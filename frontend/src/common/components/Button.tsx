import type IButton from "../../types/compontents/IButton";

const buttonHoverStyle: React.CSSProperties = {
    "--hover-bg": "color-mix(in srgb, var(--color-darkblue) 10%, transparent)",
} as React.CSSProperties;

export default function Button({icon, label, onClick}: IButton) {
    return (
        <button
            onClick={onClick}
            style={buttonHoverStyle}
            className="transition-colors flex cursor-pointer appearance-none flex-row gap-[0.625rem] rounded-lg bg-(--color-white) px-[0.75rem] py-[0.5rem] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] duration-300 ease-in-out hover:bg-[color-mix(in_srgb,var(--color-darkblue)_10%,transparent)]">
            {icon}

            <span className="text-sm font-semibold text-(--color-darkblue)">{label}</span>
        </button>
    );
}

import type ISmallButton from "../../types/compontents/ISmallButton";

export default function SmallButton({icon, label, active, pressed, classNameExtra = "", onClick}: ISmallButton) {
    const className = `px-3 py-2 flex flex-row items-center gap-2.5
        ${active ? "bg-(--color-darkblue)/5" : "bg-(--color-white)"} appearance-none rounded-lg
        shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)] cursor-pointer
        transition-colors duration-300 ease-in-out hover:bg-(--color-darkblue)/10
        focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-darkblue)
        motion-reduce:transition-none`;

    return (
        <button type="button" aria-pressed={pressed} onClick={onClick} className={`${className} ${classNameExtra}`}>
            {icon}
            <div className="text-sm font-semibold whitespace-nowrap text-(--color-darkblue)">{label}</div>
        </button>
    );
}

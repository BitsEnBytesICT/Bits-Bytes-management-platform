import type ITabs from "../../types/compontents/ITabs";

export default function Tabs({tabs, active, onChange, classNameExtra}: ITabs) {
    return (
        <div
            className={`px-4 py-2 flex flex-row gap-8 w-fit shrink-0 whitespace-nowrap bg-(--color-white) rounded-lg
                shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)] ${classNameExtra ?? ""}`}>
            {tabs.map((tab, i) => (
                <button key={tab} onClick={() => onChange(i)} className="cursor-pointer">
                    <div
                        className={`text-sm font-semibold transition-colors duration-300 ease-in-out
                        ${active === i ? "text-(--color-darkblue)" : "text-(--color-darkblue)/50 hover:text-(--color-darkblue)/75"}`}>
                        {tab}
                    </div>
                </button>
            ))}
        </div>
    );
}

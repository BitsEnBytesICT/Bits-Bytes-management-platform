import type IButton from "../../types/compontents/IButton";

export default function Button({children, onClick}: IButton) {
    return (
        <button
            className="py-4 w-full text-[18px] font-semibold text-(--color-white) rounded-xl bg-(--color-darkblue)
                cursor-pointer transition-colors hover:bg-(--color-darkblue)/90"
            onClick={onClick}
            type="submit">
            {children}
        </button>
    );
}

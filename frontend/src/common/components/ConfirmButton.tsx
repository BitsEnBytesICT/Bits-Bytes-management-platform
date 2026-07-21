import type IConfirmButton from "../../types/compontents/IConfirmButton";

export default function ConfirmButton({children, onClick, variant = "primary"}: IConfirmButton) {
    const isPrimary = variant === "primary";

    return (
        <button
            onClick={onClick}
            className={`py-2 w-25 font-semibold border-2 border-(--color-darkblue) rounded-xl cursor-pointer
                transition-colors ${
                    isPrimary
                        ? "text-(--color-white) bg-(--color-darkblue) hover:bg-(--color-darkblue)/90"
                        : "text-(--color-darkblue) bg-transparent hover:bg-(--color-darkblue)/5"
                }`}
            type="submit">
            {children}
        </button>
    );
}

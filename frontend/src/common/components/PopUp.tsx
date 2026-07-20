import type IPopUp from "../../types/compontents/IPopUp";

export default function PopUp({onClose, title, children}: IPopUp) {
    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-black)/40">
            <div
                onClick={event => event.stopPropagation()}
                className="w-full max-w-lg mx-4 p-8 flex flex-col gap-6 rounded-2xl bg-(--color-white)
                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                {title && <div className="text-center text-[20px] font-extrabold text-(--color-darkblue)">{title}</div>}

                {children}
            </div>
        </div>
    );
}

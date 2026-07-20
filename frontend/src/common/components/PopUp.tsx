import {IconClose} from "../../assets";
import type IPopUp from "../../types/compontents/IPopUp";

export default function PopUp({onClose, title, children}: IPopUp) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-black)/50">
            <div
                className="relative w-full max-w-150 h-160 px-12.5 py-10.5 flex flex-col justify-between rounded-2xl
                    bg-(--color-white) shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                <img
                    onClick={onClose}
                    src={IconClose}
                    className="absolute top-12 right-12.5 cursor-pointer select-none [-webkit-user-drag:none]"
                />

                {title && <div className="text-center text-[20px] font-extrabold text-(--color-darkblue)">{title}</div>}

                {children}
            </div>
        </div>
    );
}

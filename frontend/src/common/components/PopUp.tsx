import type IPopUp from "../../types/compontents/IPopUp";

import {IconClose} from "../../assets";

export default function PopUp({onClose, title, child}: IPopUp) {
    return (
        <div className="flex items-center justify-center fixed inset-0 z-50 bg-(--color-black)/50">
            <div
                className="px-12.5 py-10.5 flex flex-col gap-y-5 relative w-full max-w-150 min-h-160 bg-(--color-white)
                    rounded-2xl shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                <img
                    onClick={onClose}
                    src={IconClose}
                    className="absolute top-12 right-12.5 cursor-pointer select-none [-webkit-user-drag:none]"
                />

                {title && <div className="text-[20px] font-extrabold text-center text-(--color-darkblue)">{title}</div>}

                {child}
            </div>
        </div>
    );
}

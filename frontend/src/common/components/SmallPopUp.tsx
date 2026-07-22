import ConfirmButton from "./ConfirmButton";

import type ISmallPopUp from "../../types/compontents/ISmallPopUp";

import {IconClose} from "../../assets";

export default function SmallPopUp({title, message, onConfirm, onCancel}: ISmallPopUp) {
    return (
        <div className="flex items-center justify-center fixed inset-0 z-50 bg-(--color-black)/50">
            <div
                className="px-10 py-8 flex flex-col gap-6 justify-between relative w-full max-w-100 h-75
                    bg-(--color-white) rounded-2xl
                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                <img
                    onClick={onCancel}
                    src={IconClose}
                    className="absolute top-9.5 right-10 cursor-pointer select-none [-webkit-user-drag:none]"
                />

                <div className="text-[20px] font-extrabold text-center text-(--color-darkblue)">{title}</div>

                <div className="text-center text-(--color-darkblue)">{message}</div>

                <div className="flex flex-row gap-7.5 justify-center">
                    <ConfirmButton onClick={onCancel} variant="secondary">
                        Nee
                    </ConfirmButton>

                    <ConfirmButton onClick={onConfirm} variant="primary">
                        Ja
                    </ConfirmButton>
                </div>
            </div>
        </div>
    );
}

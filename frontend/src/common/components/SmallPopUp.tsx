import ConfirmButton from "./ConfirmButton";

import {IconClose} from "../../assets";
import type ISmallPopUp from "../../types/compontents/ISmallPopUp";

export default function SmallPopUp(props: ISmallPopUp) {
    return (
        <div
            className={`flex items-center justify-center fixed inset-0 z-50
                ${props.nested ? "bg-(--color-black)/25" : "bg-(--color-black)/50"}`}>
            <div
                className="px-10 py-8 flex flex-col gap-6 justify-between relative w-full max-w-100 h-75
                    bg-(--color-white) rounded-2xl
                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                <img
                    onClick={props.onCancel}
                    src={IconClose}
                    className="absolute top-9.5 right-10 cursor-pointer select-none [-webkit-user-drag:none]"
                />

                <div className="text-[20px] font-extrabold text-center text-(--color-darkblue)">{props.title}</div>

                <div className="flex justify-around text-center text-(--color-darkblue)">{props.message}</div>

                <div className="flex flex-row gap-7.5 justify-center">
                    {"confirmationButtons" in props ? (
                        props.confirmationButtons
                    ) : (
                        <>
                            <ConfirmButton onClick={props.onCancel} variant="secondary">
                                Nee
                            </ConfirmButton>

                            <ConfirmButton onClick={props.onConfirm} variant="primary">
                                Ja
                            </ConfirmButton>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

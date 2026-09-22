import ConfirmButton from "./ConfirmButton";
import {useId} from "react";
import {createPortal} from "react-dom";
import useDialog from "../hooks/useDialog";

import type ISmallPopUp from "../../types/compontents/ISmallPopUp";

import {IconClose} from "../../assets";

export default function SmallPopUp({title, message, onConfirm, onCancel}: ISmallPopUp) {
    const dialogRef = useDialog();
    const titleId = useId();
    const messageId = useId();

    return createPortal(
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            aria-describedby={messageId}
            onCancel={event => {
                event.preventDefault();
                onCancel();
            }}
            className="m-auto p-0 w-[calc(100%-2rem)] max-w-100 max-h-[calc(100dvh-2rem)] overflow-y-auto
                text-(--color-offblack) bg-(--color-white) border-0 rounded-2xl backdrop:bg-(--color-black)/50">
            <div
                className="px-10 py-8 flex flex-col gap-6 justify-between relative w-full min-h-75 bg-(--color-white)
                    rounded-2xl shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                <button
                    type="button"
                    aria-label="Sluiten"
                    onClick={onCancel}
                    className="absolute top-9.5 right-10 cursor-pointer rounded-sm focus-visible:outline-2
                        focus-visible:outline-offset-4 focus-visible:outline-(--color-darkblue)">
                    <img alt="" src={IconClose} className="h-5 w-5 select-none [-webkit-user-drag:none]" />
                </button>

                <h2 id={titleId} className="px-5 text-[20px] font-extrabold text-center text-(--color-darkblue)">
                    {title}
                </h2>

                <div id={messageId} className="text-center text-(--color-darkblue) wrap-anywhere">
                    {message}
                </div>

                <div className="flex flex-row gap-7.5 justify-center">
                    <ConfirmButton onClick={onCancel} variant="secondary">
                        Nee
                    </ConfirmButton>

                    <ConfirmButton onClick={onConfirm} variant="primary">
                        Ja
                    </ConfirmButton>
                </div>
            </div>
        </dialog>,
        document.body,
    );
}

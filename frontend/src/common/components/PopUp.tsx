import type IPopUp from "../../types/compontents/IPopUp";
import {useId} from "react";
import {createPortal} from "react-dom";
import useDialog from "../hooks/useDialog";

import {IconClose} from "../../assets";

export default function PopUp({onClose, title, child, compact = false}: IPopUp) {
    const dialogRef = useDialog();
    const titleId = useId();

    return createPortal(
        <dialog
            ref={dialogRef}
            aria-labelledby={title ? titleId : undefined}
            aria-label={title ? undefined : "Dialoogvenster"}
            onCancel={event => {
                event.preventDefault();
                onClose();
            }}
            className="m-auto p-0 w-[calc(100%-2rem)] max-w-150 max-h-[calc(100dvh-2rem)] overflow-y-auto
                text-(--color-offblack) bg-(--color-white) border-0 rounded-2xl backdrop:bg-(--color-black)/50">
            <div
                className={`px-12.5 py-10.5 flex flex-col gap-y-7 relative w-full ${compact ? "" : "min-h-160"}
                    rounded-2xl shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]`}>
                <button
                    type="button"
                    aria-label="Sluiten"
                    onClick={onClose}
                    className="absolute top-12 right-12.5 cursor-pointer rounded-sm focus-visible:outline-2
                        focus-visible:outline-offset-4 focus-visible:outline-(--color-darkblue)">
                    <img alt="" src={IconClose} className="h-5 w-5 select-none [-webkit-user-drag:none]" />
                </button>

                {title && (
                    <h2 id={titleId} className="px-6 text-[20px] font-extrabold text-center text-(--color-darkblue)">
                        {title}
                    </h2>
                )}

                {child}
            </div>
        </dialog>,
        document.body,
    );
}

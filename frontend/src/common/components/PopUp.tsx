import type IPopUp from "../../types/compontents/IPopUp";

import {IconClose} from "../../assets";
import {useState} from "react";
import Button from "./Button";

export default function PopUp({onClose, title, children, button, errors}: IPopUp) {
    const [page, setPage] = useState(0);

    return (
        <div className="flex items-center justify-center fixed inset-0 z-50 bg-(--color-black)/50">
            <div
                className="px-12.5 py-10.5 flex flex-col gap-y-7 relative w-full max-w-150 min-h-160 bg-(--color-white)
                    rounded-2xl shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                <img
                    onClick={onClose}
                    src={IconClose}
                    className="absolute top-12 right-12.5 cursor-pointer select-none [-webkit-user-drag:none]"
                />

                {title && <div className="text-[20px] font-extrabold text-center text-(--color-darkblue)">{title}</div>}

                <div className="flex flex-1 flex-col gap-y-7">
                    {children[page]}
                    <div className="flex flex-col h-6">
                        {errors &&
                            errors.map(e => (
                                <span
                                    key={e}
                                    className="text-[16px] font-semibold text-(--color-red)
                                        animate-[fade-in_0.3s_ease-in-out]">
                                    {e}
                                </span>
                            ))}
                    </div>
                    <div className="mt-auto flex gap-x-3">
                        {page > 0 && (
                            <Button
                                onClick={() => {
                                    setPage(page - 1);
                                }}>
                                {"vorige"}
                            </Button>
                        )}
                        {page < children.length - 1 && (
                            <Button
                                onClick={() => {
                                    setPage(page + 1);
                                }}>
                                {"Volgende"}
                            </Button>
                        )}
                        {page === children.length - 1 && button}
                    </div>
                </div>
            </div>
        </div>
    );
}

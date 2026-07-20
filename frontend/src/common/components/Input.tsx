import {forwardRef} from "react";

import type IInput from "../../types/compontents/IInput";

const Input = forwardRef<HTMLInputElement, IInput>(({label, placeholder, id, type, value, readOnly}, ref) => {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="ml-1.5 text-[16px] font-semibold text-(--color-darkblue)" htmlFor={id}>
                    {label}
                </label>
            )}

            <input
                className={`px-5 py-3 text-[16px] text-(--color-offblack) rounded-xl bg-(--color-offwhite)
                    shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)] outline-none
                    transition-colors focus:shadow-[inset_0_0_0_1px_var(--color-darkblue)] ${
                        readOnly ? "cursor-default" : ""
                    }`}
                id={id}
                placeholder={placeholder}
                defaultValue={value}
                readOnly={readOnly}
                ref={ref}
                type={type}
            />
        </div>
    );
});

export default Input;

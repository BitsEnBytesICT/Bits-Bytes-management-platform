import {forwardRef} from "react";

import type IInput from "../../types/compontents/IInput";

const Input = forwardRef<HTMLInputElement, IInput>(
    ({label, placeholder, id, type, value, checked, readOnly}, ref) => {
        if (type === "checkbox") {
            return (
                <div className="flex flex-col gap-2">
                    {label && (
                        <label className="ml-1.5 text-[16px] font-semibold text-(--color-darkblue)" htmlFor={id}>
                            {label}
                        </label>
                    )}

                    <div className="py-3 flex items-center">
                        <input
                            className="ml-1.5 w-5 h-5 accent-(--color-darkblue)"
                            id={id}
                            defaultChecked={checked}
                            disabled={readOnly}
                            ref={ref}
                            type="checkbox"
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-2">
                {label && (
                    <label className="ml-1.5 text-[16px] font-semibold text-(--color-darkblue)" htmlFor={id}>
                        {label}
                    </label>
                )}

                <input
                    className={`px-5 py-3 text-[16px] text-(--color-offblack) bg-(--color-offwhite) outline-none rounded-xl
                        shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)] transition-colors
                        focus:shadow-[inset_0_0_0_1px_var(--color-darkblue)] ${readOnly ? "cursor-default" : ""}`}
                    id={id}
                    placeholder={placeholder}
                    defaultValue={value}
                    readOnly={readOnly}
                    ref={ref}
                    type={type}
                />
            </div>
        );
    },
);

export default Input;

import {forwardRef, useState} from "react";

import type IInput from "../../types/compontents/IInput";

const Input = forwardRef<HTMLInputElement, IInput>(
    (
        {label, placeholder, id, type, value = "", checked = false, readOnly = false, required = false, onChange},
        ref,
    ) => {
        const [isFilledIn, setIsFilledIn] = useState(Boolean(value));

        if (type === "checkbox") {
            return (
                <div className="flex flex-col gap-2">
                    {label && (
                        <label className="ml-1.5 text-[16px] font-semibold text-(--color-darkblue)" htmlFor={id}>
                            {`${label} ${required ? "*" : ""}`}
                        </label>
                    )}

                    <div className="py-3 flex items-center">
                        <input
                            className="ml-1.5 w-5 h-5 accent-(--color-darkblue)"
                            id={id}
                            checked={checked}
                            disabled={readOnly}
                            ref={ref}
                            type="checkbox"
                            onChange={e => onChange(e.target.checked)}
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-2">
                {label && (
                    <label className="ml-1.5 text-[16px] font-semibold text-(--color-darkblue)" htmlFor={id}>
                        {`${label} ${required ? "*" : ""}`}
                    </label>
                )}

                <input
                    className={`px-5 py-3 text-[16px] text-(--color-offblack) bg-(--color-offwhite) outline-none
                        rounded-xl shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]
                        transition-colors focus:shadow-[inset_0_0_0_1px_var(--color-darkblue)]
                        ${readOnly ? "cursor-default" : ""}`}
                    id={id}
                    placeholder={placeholder}
                    defaultValue={value}
                    readOnly={readOnly}
                    ref={ref}
                    type={type}
                    onChange={e => {
                        setIsFilledIn(Boolean(e.target.value));
                        onChange(e.target.value || value);
                    }}
                />
                {!isFilledIn && required && (
                    <span className="ml-1.5 text-[16px] font-semibold text-(--color-red)">Dit veld is verplicht</span>
                )}
            </div>
        );
    },
);

export default Input;

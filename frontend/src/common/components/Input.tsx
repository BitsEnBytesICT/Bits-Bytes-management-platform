import {forwardRef, useState, type ChangeEvent, type ForwardedRef} from "react";
import Select from "react-select";

import type IInput from "../../types/compontents/IInput";
import {assertNever} from "../helperFunctions";

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, IInput>((props, ref) => {
    const [isFilledIn, setIsFilledIn] = useState(true);

    let inputProps = {};

    if (props.type === "textarea" || props.type === "text" || props.type === "password") {
        inputProps = {
            className:
                props.className ??
                `px-[15px] py-3 placeholder:text-(--color-offblack)/50 bg-(--color-offwhite) outline-none rounded-xl
                transition-colors focus:shadow-[inset_0_0_0_1px_var(--color-darkblue)]
                ${props.readOnly ? "cursor-default" : ""} ${
                    !isFilledIn && props.required
                        ? `shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-red)_50%,transparent)]
                            focus:shadow-[inset_0_0_0_1px_var(--color-red)]`
                        : `shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]
                            focus:shadow-[inset_0_0_0_1px_var(--color-darkblue)]`
                }`,
            id: props.id,
            placeholder: props.placeholder,
            defaultValue: props.value,
            readOnly: props.readOnly,
            onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setIsFilledIn(Boolean(e.target.value));
                props.onChange?.(e.target.value);
            },
        };
    }

    switch (props.type) {
        case "checkbox":
            return (
                <div className="flex flex-col gap-2">
                    {props.label && (
                        <label
                            className={props.labelClassName ?? "ml-1.5 font-semibold text-(--color-darkblue)"}
                            htmlFor={props.id}>
                            {`${props.label} ${props.required ? "*" : ""}`}
                        </label>
                    )}

                    <div className="py-3 flex items-center">
                        <input
                            className={props.className ?? "ml-1.5 w-5 h-5 accent-(--color-darkblue)"}
                            id={props.id}
                            checked={props.checked}
                            disabled={props.readOnly}
                            ref={ref as ForwardedRef<HTMLInputElement>}
                            type="checkbox"
                            onChange={e => props.onChange?.(e.target.checked)}
                        />
                    </div>
                </div>
            );
        case "textarea":
            return (
                <div className={`flex flex-col gap-2`}>
                    {props.label && (
                        <label
                            className={props.labelClassName ?? "ml-1.5 font-semibold text-(--color-darkblue)"}
                            htmlFor={props.id}>
                            {`${props.label} ${props.required ? "*" : ""}`}
                        </label>
                    )}

                    <textarea
                        {...inputProps}
                        ref={ref as ForwardedRef<HTMLTextAreaElement>}
                        style={{resize: "none"}}
                        rows={Math.min(50, Math.max(4, props.rows ?? 4))}
                    />
                </div>
            );
        case "text":
        case "password":
            return (
                <div className={`flex flex-col gap-2`}>
                    {props.label && (
                        <label
                            className={props.labelClassName ?? "ml-1.5 font-semibold text-(--color-darkblue)"}
                            htmlFor={props.id}>
                            {`${props.label} ${props.required ? "*" : ""}`}
                        </label>
                    )}

                    <input {...inputProps} ref={ref as ForwardedRef<HTMLInputElement>} type={props.type} />
                </div>
            );
        case "select":
            return (
                <div className={`flex flex-col gap-2 ${props.className ?? ""}`}>
                    {props.label && (
                        <label
                            className={props.labelClassName ?? "ml-1.5 font-semibold text-(--color-darkblue)"}
                            htmlFor={props.id}>
                            {`${props.label} ${props.required ? "*" : ""}`}
                        </label>
                    )}

                    <Select
                        inputId={props.id}
                        options={props.options}
                        value={props.options.find(option => option.value === props.value) ?? null}
                        inputValue={props.inputValue}
                        onChange={option => props.onChange?.(option?.value ?? "")}
                        onMenuOpen={props.onMenuOpen}
                        onMenuClose={props.onMenuClose}
                        onInputChange={props.onInputChange}
                        isSearchable
                        isDisabled={props.readOnly}
                        required={props.required}
                        placeholder={props.placeholder ?? "Selecteer..."}
                        noOptionsMessage={() => "Geen resultaten"}
                        menuPlacement="auto"
                        unstyled
                        classNames={{
                            control: ({isFocused}) =>
                                `px-[15px] py-3 bg-(--color-offwhite) rounded-xl
                                cursor-pointer transition-colors ${
                                    isFocused
                                        ? "shadow-[inset_0_0_0_1px_var(--color-darkblue)]"
                                        : "shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]"
                                }`,
                            valueContainer: () => "gap-1",
                            placeholder: () => "text-(--color-offblack)/50",
                            singleValue: () => "text-inherit",
                            input: () => "text-(--color-darkblue)",
                            dropdownIndicator: () => "text-(--color-darkblue)",
                            menu: () =>
                                `py-2 text-(--color-darkblue) bg-(--color-white) rounded-xl shadow-lg overflow-hidden
                                shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]`,
                            option: ({isFocused, isSelected}) =>
                                `px-[15px] py-2 cursor-pointer transition-colors duration-300 ease-in-out ${
                                    isSelected || isFocused ? "bg-(--color-darkblue)/5" : ""
                                }`,
                            noOptionsMessage: () => "px-[15px] py-2 opacity-50",
                        }}
                        styles={{menu: base => ({...base, minWidth: "100%", right: 0, marginTop: 0, marginBottom: 0})}}
                    />
                </div>
            );
        default:
            return assertNever(props);
    }
});

export default Input;

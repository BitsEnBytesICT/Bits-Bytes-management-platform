import type {InputActionMeta} from "react-select";

interface InputBase {
    id: string;
    label?: string;
    labelPos?: "top" | "left" | "right" | "bottom";
    className?: string;
    labelClassName?: string;
    readOnly?: boolean;
    required?: boolean;
}

interface CheckboxInput extends InputBase {
    type: "checkbox";
    checked?: boolean;
    onChange?: (input: boolean) => void;
}

interface TextInput extends InputBase {
    type: "text" | "password";
    placeholder?: string;
    value?: string;
    onChange?: (input: string) => void;
}

interface TextareaInput extends InputBase {
    type: "textarea";
    rows?: number;
    placeholder?: string;
    value?: string;
    onChange?: (input: string) => void;
}

interface DateInput extends InputBase {
    type: "date" | "datetime-local";
    value?: string;
    min?: string;
    max?: string;
    icon?: string;
    iconClassName?: string;
    onChange?: (input: string) => void;
}

interface SelectInput extends InputBase {
    type: "select";
    options: {label: string; value: string}[];
    placeholder?: string;
    value?: string;
    inputValue?: string;
    onMenuOpen?: () => void;
    onMenuClose?: () => void;
    onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
    onChange?: (input: string) => void;
}

type IInput = CheckboxInput | TextInput | TextareaInput | DateInput | SelectInput;

export type {IInput as default};

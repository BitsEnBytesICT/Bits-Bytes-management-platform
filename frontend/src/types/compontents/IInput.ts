interface InputBase {
    label?: string;
    id: string;
    className?: string;
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

type IInput = CheckboxInput | TextInput;

export type {IInput as default};

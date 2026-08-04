export default interface IInput {
    label?: string;
    placeholder?: string;
    id: string;
    type: string;
    value?: string;
    checked?: boolean;
    readOnly?: boolean;
    required?: boolean;
    forceTouched?: boolean;
    onChange?: (input: string | Boolean | undefined) => void;
}

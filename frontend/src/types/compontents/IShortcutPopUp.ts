import type IShortcut from "../accounts/IShortcut";

export default interface IShortcutPopUp {
    shortcuts: IShortcut[];
    onClose: () => void;
    onSaved: () => Promise<void> | void;
}

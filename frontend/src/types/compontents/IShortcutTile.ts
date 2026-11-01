import type IShortcut from "../accounts/IShortcut";

export default interface IShortcutTile {
    shortcut: IShortcut;
    icon?: string;
    onClick?: () => void;
}

import {useEffect, useState} from "react";

import ShortcutPopUp from "./ShortcutPopUp";
import ShortcutTile, {tileClassName} from "./ShortcutTile";

import ShortcutService from "./Shortcut.service";

import type IShortcut from "../../../types/accounts/IShortcut";

import {IconEdit} from "../../../assets";

export default function Shortcuts() {
    const [shortcuts, setShortcuts] = useState<IShortcut[]>([]);

    const service = new ShortcutService();
    const [isManageShown, setIsManageShown] = useState(false);

    useEffect(() => {
        getShortcuts();
    }, []);

    async function getShortcuts(): Promise<void> {
        setShortcuts(await service.getShortcuts());
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="text-[18px] font-medium text-(--color-darkblue)">Jouw snelkoppelingen</div>

            <div className="flex flex-row flex-wrap gap-4">
                {shortcuts.map(shortcut => (
                    <ShortcutTile key={shortcut.url} shortcut={shortcut} />
                ))}

                <div onClick={() => setIsManageShown(true)} title="Snelkoppelingen beheren" className={tileClassName}>
                    <img src={IconEdit} className="size-6 select-none [-webkit-user-drag:none]" />
                </div>
            </div>

            {isManageShown && (
                <ShortcutPopUp shortcuts={shortcuts} onClose={() => setIsManageShown(false)} onSaved={getShortcuts} />
            )}
        </div>
    );
}

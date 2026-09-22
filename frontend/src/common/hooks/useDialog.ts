import {useEffect, useRef} from "react";

export default function useDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        const previousFocus = document.activeElement;

        if (!dialog) return;

        dialog.showModal();
        dialog.querySelector<HTMLElement>("input:not([disabled]), textarea:not([disabled])")?.focus();

        function keepFocusInside(event: KeyboardEvent) {
            if (event.key !== "Tab") return;

            const focusable = Array.from(
                dialog.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
                ),
            ).filter(element => element.getClientRects().length > 0 && !element.closest("[hidden], [inert]"));
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (!first || !last) {
                event.preventDefault();
                return;
            }

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }

        dialog.addEventListener("keydown", keepFocusInside);

        return () => {
            dialog.removeEventListener("keydown", keepFocusInside);
            dialog.close();
            if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
        };
    }, []);

    return dialogRef;
}

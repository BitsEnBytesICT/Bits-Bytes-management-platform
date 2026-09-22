import assert from "node:assert/strict";
import {afterEach, describe, it} from "node:test";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import useLocalStorage from "../src/common/hooks/useLocalStorage.ts";

const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");

function renderStorage(getItem: () => string | null, setItem: (key: string, value: string) => void = () => {}) {
    Object.defineProperty(globalThis, "window", {configurable: true, value: {localStorage: {getItem, setItem}}});
    let save: (value: unknown) => boolean = () => false;

    function StorageProbe() {
        const [value, setValue] = useLocalStorage<unknown>("participantDashboard.shortcuts.v1", []);
        save = setValue;
        return createElement("output", null, JSON.stringify(value));
    }

    const markup = renderToStaticMarkup(createElement(StorageProbe));
    return {markup, save};
}

afterEach(() => {
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
});

describe("shortcut storage failures", () => {
    it("starts empty when no saved value exists", () => {
        assert.equal(renderStorage(() => null).markup, "<output>[]</output>");
    });

    it("recovers from malformed JSON", () => {
        assert.equal(renderStorage(() => "{broken json").markup, "<output>[]</output>");
    });

    it("recovers when reading storage is blocked", () => {
        const result = renderStorage(() => {
            throw new Error("Storage disabled");
        });
        assert.equal(result.markup, "<output>[]</output>");
    });

    it("reports a successful write using the versioned storage key", () => {
        const writes: string[][] = [];
        const {save} = renderStorage(
            () => null,
            (key, value) => {
                writes.push([key, value]);
            },
        );
        const shortcuts = [{id: "one", label: "Website", url: "https://example.nl/"}];
        assert.equal(save(shortcuts), true);
        assert.deepEqual(writes, [["participantDashboard.shortcuts.v1", JSON.stringify(shortcuts)]]);
    });

    it("reports a failed write without throwing when storage is full or blocked", () => {
        const {save} = renderStorage(
            () => null,
            () => {
                throw new Error("Storage full");
            },
        );
        assert.equal(save([]), false);
    });
});

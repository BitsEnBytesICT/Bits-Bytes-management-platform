import {useState} from "react";

export default function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });

    function setValue(value: T) {
        setStoredValue(value);

        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            return;
        }
    }

    return [storedValue, setValue];
}

export const assertNever = (x: never): never => {
    throw new Error("Unexpected value: " + x);
};

export function toDateString(date: Date): string {
    if (!date) return "";
    return date.toISOString().slice(0, 19).replace("T", " ");
}

export function fromDateString(dateString: string): Date {
    if (!dateString) return;
    return new Date(dateString.replace(" ", "T") + "Z");
}

export function toShortDateString(date: Date): string {
    if (!date) return "";
    return date.toISOString().slice(0, 10);
}

export function fromShortDateString(dateString: string): Date {
    if (!dateString) return;
    return new Date(`${dateString}T00:00:00Z`);
}

export const isSvg = (signature?: string): boolean => signature?.trimStart().startsWith("<svg") ?? false;

// the backend stores dates as UTC strings without timezone ("YYYY-MM-DD HH:mm:ss")
export const fromBackendDate = (value: string): Date => new Date(`${value.replace(" ", "T")}Z`);

export const toBackendDate = (date: Date): string => date.toISOString().slice(0, 19).replace("T", " ");

export const formatDate = (date?: Date): string => {
    if (!date || isNaN(date.getTime())) return "-";

    return date.toLocaleString("nl-NL", {dateStyle: "short", timeStyle: "short"});
};

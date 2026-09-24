export const assertNever = (x: never): never => {
    throw new Error("Unexpected value: " + x);
};

// the backend stores dates as UTC strings without timezone ("YYYY-MM-DD HH:mm:ss")
export const fromBackendDate = (value: string): Date => new Date(`${value.replace(" ", "T")}Z`);

export const toBackendDate = (date: Date): string => date.toISOString().slice(0, 19).replace("T", " ");

export const formatDate = (date?: Date): string => {
    if (!date || isNaN(date.getTime())) return "-";

    return date.toLocaleString("nl-NL", {dateStyle: "short", timeStyle: "short"});
};

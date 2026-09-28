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

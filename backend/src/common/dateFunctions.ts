export function getCurrentDate(): string {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

export function toDateString(date: Date): string {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

export function fromDateString(dateString: string): Date {
    return new Date(dateString.replace(' ', 'T') + 'Z');
}
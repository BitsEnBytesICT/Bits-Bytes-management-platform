import http from "../http";
import type ICalendar from "../../types/accounts/ICalendar";

export default class CalendarService {
    getCalendars = async (): Promise<ICalendar[]> => {
        const response = await http("/api/account/calendars", "POST");
        if (response.status === 200) return await response.json();
        else return [];
    };

    updateCalendars = async (calendars: ICalendar[]): Promise<string[]> => {
        const response = await http("/api/account/calendars/update", "POST", {calendars: calendars});
        if (response.status === 200) return;
        else return await response.json();
    };
}

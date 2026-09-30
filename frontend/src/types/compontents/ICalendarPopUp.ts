import type ICalendar from "../accounts/ICalendar";

export default interface ICalendarPopUp {
    calendars: ICalendar[];
    onClose: () => void;
    onSaved: () => Promise<void> | void;
}

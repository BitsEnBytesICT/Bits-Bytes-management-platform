export default interface ISchedule {
    id?: number;
    name: string;
    startDate: string;
    participant: number;
    endDate?: string | null;
    monMorning?: number | null;
    monEvening?: number | null;
    thuesMorning?: number | null;
    thuesEvening?: number | null;
    wedMorning?: number | null;
    wedEvening?: number | null;
    thursMorning?: number | null;
    thursEvening?: number | null;
    friMorning?: number | null;
    friEvening?: number | null;
}

export default interface ISchedule {
    id?: number;
    name: string;
    startDate: Date;
    endDate?: Date;
    participant: number;
    monMorning?: number;
    monEvening?: number;
    thuesMorning?: number;
    thuesEvening?: number;
    wedMorning?: number;
    wedEvening?: number;
    thursMorning?: number;
    thursEvening?: number;
    friMorning?: number;
    friEvening?: number;
}

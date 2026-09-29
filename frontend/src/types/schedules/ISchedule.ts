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

export const scheduleFieldsByDay = [
    ["monMorning", 0, "Ochtend"],
    ["monEvening", 0, "Middag"],
    ["thuesMorning", 1, "Ochtend"],
    ["thuesEvening", 1, "Middag"],
    ["wedMorning", 2, "Ochtend"],
    ["wedEvening", 2, "Middag"],
    ["thursMorning", 3, "Ochtend"],
    ["thursEvening", 3, "Middag"],
    ["friMorning", 4, "Ochtend"],
    ["friEvening", 4, "Middag"],
] as const;

export default interface IAttendance {
    id?: number;
    deelnemerID: number;
    clockinDate: string;
    clockoutDate: string | null;
    workDuration: number | null;
}

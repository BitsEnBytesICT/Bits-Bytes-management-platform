export default interface IAttendance {
    id?: number;
    participantID: number;
    clockinDate: string;
    clockoutDate?: string;
    workDuration?: number;
}
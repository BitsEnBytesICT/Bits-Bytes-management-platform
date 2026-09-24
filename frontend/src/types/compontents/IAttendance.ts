export default interface IAttendance {
    id?: number;
    participantID: number;
    clockinDate: Date;
    clockoutDate?: Date;
    workDuration?: number;
    signature: string; //svg
}

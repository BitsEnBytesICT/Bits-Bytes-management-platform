export default interface IParticipant {
    id?: number;
    firstname: string;
    lastname: string;
    organisation: string;
    account: number;
    rfid: string;
    createdAt: string;
    active: number;
    clockedin?: number;
    financing?: string;
}

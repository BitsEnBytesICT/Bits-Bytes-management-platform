export default interface IDeelnemer {
    id?: number;
    firstname: string;
    lastname: string;
    organisation: string;
    account: number;
    rfid: string;
    createdAt: string;
    active: number;
    clockedin?: number;
    product?: string;
}

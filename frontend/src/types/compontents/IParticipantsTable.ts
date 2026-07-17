import type IParticipant from "./IParticipant";

export default interface IDeelnemerTable {
    tableColumns: (keyof IParticipant)[];
    participants: IParticipant[];
}

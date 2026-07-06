import type IDeelnemer from "./IParticipant";

export default interface IDeelnemerTable {
    tableColumns: (keyof IDeelnemer)[];
}

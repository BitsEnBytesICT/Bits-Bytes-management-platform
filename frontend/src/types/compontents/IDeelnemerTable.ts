import type IDeelnemer from "./IDeelnemer"

export default interface IDeelnemerTable {
    tableColumns: (keyof IDeelnemer)[]
}

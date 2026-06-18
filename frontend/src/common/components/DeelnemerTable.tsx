import type IDeelnemer from "../../types/compontents/IDeelnemer";

export default function DeelnemerTable({tableColumns}: {tableColumns: (keyof IDeelnemer)[]}) {
    return (
        <>
            table hier waar de colommen uit tableColumns komen de keys van IDeelnemer moeten hetzelfde zijn als de
            database table column names (zie erd)
        </>
    );
}

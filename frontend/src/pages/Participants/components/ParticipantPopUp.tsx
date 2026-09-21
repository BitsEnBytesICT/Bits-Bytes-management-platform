import {useEffect, useState} from "react";
import Button from "../../../common/components/Button";
import Input from "../../../common/components/Input";
import PopUp from "../../../common/components/PopUp";

import type IParticipant from "../../../types/compontents/IParticipant";
import ParticipantsService from "../Participants.service";
import type IAccount from "../../../types/accounts/IAccount";
import {PermissionsList} from "../../../types/accounts/accountTypes";
import {Roles} from "../../../types/permissions/rolesList";
import type {KeyValuePair} from "../../../types/validation/keyvaluePair";
import FloorPlans from "../../../common/components/floorplans/FloorPlans";
import type {IRoom} from "../../../types/floorPlans/IRoom";
import ParticipantpopUpFloorplans from "./ParticipantpopUpFloorplans";

type ParticipantPopUpMode = "info" | "add" | "edit";

interface IParticipantPopUp {
    mode: ParticipantPopUpMode;
    participants: IParticipant[];
    rooms: IRoom[];
    participant?: IParticipant;
    account?: IAccount;
    onClose: () => void;
    setParticipants?: (value: IParticipant[]) => void;
}

const titles: Record<ParticipantPopUpMode, string> = {
    info: "Deelnemer Info",
    add: "Deelnemer Toevoegen",
    edit: "Deelnemer Bewerken",
};

export default function ParticipantPopUp({
    mode,
    participant,
    account,
    onClose,
    setParticipants,
    participants,
    rooms,
}: IParticipantPopUp) {
    const [currentParticipant, setCurrentParticipant] = useState(participant);
    const [password, setPassword] = useState(account?.password);
    const [error, setError] = useState([]);
    const [selectPlaceholder, setSelectPlaceholder] = useState("naam van schema...");
    const [scheduleName, setScheduleName] = useState("");
    const [toggleScheduleScreen, setToggleScheduleScreen] = useState(false);
    const isInfo = mode === "info";

    const service: ParticipantsService = new ParticipantsService();

    useEffect(() => {
        if (isInfo) {
            return;
        }

        if (
            !currentParticipant?.firstname ||
            !currentParticipant?.lastname ||
            !currentParticipant?.organisation ||
            (!account?.password && !password) ||
            !currentParticipant?.rfid
        ) {
            setError(["De velden met * zijn verplicht"]);
        } else {
            setError([]);
        }
    }, [currentParticipant]);

    async function save() {
        if (
            !currentParticipant?.firstname ||
            !currentParticipant?.lastname ||
            !currentParticipant?.organisation ||
            (!account?.password && !password) ||
            !currentParticipant?.rfid
        )
            return;

        if (mode === "add") {
            const newAccount: IAccount = {
                type: PermissionsList.participant,
                firstname: currentParticipant.firstname,
                lastname: currentParticipant.lastname,
                username: `${currentParticipant.firstname}${currentParticipant.lastname.slice(0, 1)}`,
                role: Roles.admin,
                password: password,
            };

            currentParticipant.active = currentParticipant.active ? currentParticipant.active : 0;
            const error = await service.createParticipant(currentParticipant, newAccount);
            if (error) {
                setError(error);
                return;
            }
        } else if (mode === "edit") {
            if (password !== account.password) {
                const error = await service.updateAccount(["id", account.id], ["password", password]);
                if (error) {
                    setError(error);
                    return;
                }
            }

            const updatedFields = (Object.keys(currentParticipant) as Array<keyof IParticipant>)
                .filter(key => currentParticipant[key] !== participant[key])
                .map(key => [key, currentParticipant[key]]);
            if (updatedFields.length < 1) {
                onClose();
                return;
            }
            const error = await service.updateParticipant(
                ["id", currentParticipant.id],
                ...(updatedFields as KeyValuePair<IParticipant>[]),
            );

            if (error) {
                setError(error);
                return;
            }
        }

        setParticipants(await service.getParticipants());
        onClose();
    }

    return (
        <PopUp
            onClose={onClose}
            title={titles[mode]}
            errors={error}
            children={[
                <>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <Input
                            label="Naam"
                            placeholder="Naam"
                            id="firstname"
                            type="text"
                            value={currentParticipant?.firstname}
                            readOnly={isInfo}
                            required={!isInfo}
                            onChange={(value: string) =>
                                setCurrentParticipant({...currentParticipant, firstname: value})
                            }
                        />
                        <Input
                            label="Achternaam"
                            placeholder="Achternaam"
                            id="lastname"
                            type="text"
                            value={currentParticipant?.lastname}
                            readOnly={isInfo}
                            required={!isInfo}
                            onChange={(value: string) =>
                                setCurrentParticipant({...currentParticipant, lastname: value})
                            }
                        />
                        <Input
                            label="Organisatie"
                            placeholder="Organisatie"
                            id="organisation"
                            type="text"
                            value={currentParticipant?.organisation}
                            readOnly={isInfo}
                            required={!isInfo}
                            onChange={(value: string) =>
                                setCurrentParticipant({...currentParticipant, organisation: value})
                            }
                        />
                        <Input
                            label="Actief"
                            id="active"
                            type="checkbox"
                            checked={Boolean(currentParticipant?.active)}
                            readOnly={isInfo}
                            onChange={(value: boolean) =>
                                setCurrentParticipant({...currentParticipant, active: value ? 1 : 0})
                            }
                        />
                        {isInfo && (
                            <Input
                                label="Username"
                                placeholder="Username"
                                id="username"
                                type="text"
                                value={account.username}
                                readOnly={true}
                                required={false}
                            />
                        )}
                        <Input
                            label="Password"
                            placeholder="Password"
                            id="password"
                            type="text"
                            value={mode !== "add" && account?.password ? `${account?.password}` : ""}
                            readOnly={isInfo}
                            onChange={(value: string) => setPassword(value)}
                            required={!isInfo}
                        />
                        <Input
                            label="RFID Tag"
                            placeholder="RFID Tag"
                            id="rfid"
                            type="text"
                            value={currentParticipant?.rfid}
                            readOnly={isInfo}
                            required={!isInfo}
                            onChange={(value: string) => setCurrentParticipant({...currentParticipant, rfid: value})}
                        />
                        {isInfo && (
                            <Input
                                label="Aanwezig"
                                placeholder="Aanwezig"
                                id="clockedin"
                                type="text"
                                value={currentParticipant?.clockedin === 1 ? "Aanwezig" : "Afwezig"}
                                readOnly
                            />
                        )}
                        <Input
                            label="Financiering"
                            placeholder="Financiering"
                            id="financing"
                            type="text"
                            value={currentParticipant?.financing ?? ""}
                            readOnly={isInfo}
                            onChange={(value: string) =>
                                setCurrentParticipant({...currentParticipant, financing: value})
                            }
                        />
                        {isInfo && (
                            <Input
                                label="Huidige plek"
                                placeholder="Huidige plek"
                                id="location"
                                type="text"
                                readOnly={isInfo}
                            />
                        )}
                    </div>
                </>,
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="Schema toevoegen of bewerken"
                        placeholder={selectPlaceholder}
                        id="location"
                        type="select"
                        options={[]}
                        inputValue={scheduleName}
                        readOnly={isInfo}
                        onMenuOpen={() => setSelectPlaceholder("")}
                        onMenuClose={() => setSelectPlaceholder("naam van schema...")}
                        onInputChange={(newValue, actionMeta) => {
                            if (actionMeta.action === "input-change") {
                                setScheduleName(newValue);
                            }
                        }}
                    />
                    <div className="mt-auto">
                        {scheduleName && !isInfo && (
                            <Button onClick={() => setToggleScheduleScreen(true)}>Schema aanmaken</Button>
                        )}
                    </div>
                    {toggleScheduleScreen && (
                        <>
                            <div className="col-span-full">
                                <FloorPlans
                                    participants={participants}
                                    rooms={rooms}
                                    height="h-42"
                                    popUpContent={ParticipantpopUpFloorplans}></FloorPlans>
                            </div>
                            <Button onClick={() => setToggleScheduleScreen(true)}>Schema oplsaan</Button>
                        </>
                    )}
                </div>,
            ]}
            button={
                <Button
                    onClick={async () => {
                        isInfo ? onClose() : await save();
                    }}>
                    {isInfo ? "Terug" : mode === "edit" ? "Bewerken" : "Opslaan"}
                </Button>
            }
        />
    );
}

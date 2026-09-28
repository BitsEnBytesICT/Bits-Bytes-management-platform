import {useEffect, useState} from "react";
import Button from "../../../common/components/Button";
import Input from "../../../common/components/Input";
import PopUp from "../../../common/components/PopUp";

import ParticipantsService from "../Participants.service";
import type IAccount from "../../../types/accounts/IAccount";
import {PermissionsList} from "../../../types/accounts/accountTypes";
import {Roles} from "../../../types/permissions/rolesList";
import type {KeyValuePair} from "../../../types/validation/keyvaluePair";
import FloorPlans from "../../../common/components/floorplans/FloorPlans";
import type {IRoom} from "../../../types/floorPlans/IRoom";
import ParticipantpopUpFloorplans from "./ParticipantpopUpFloorplans";
import type ISchedule from "../../../types/schedules/ISchedule";
import {fromDateString, toDateString} from "../../../common/helperFunctions";
import type {IParticipant, IParticipantWithSchedules} from "../../../types/compontents/IParticipant";

type ParticipantPopUpMode = "info" | "add" | "edit";

interface IParticipantPopUp {
    mode: ParticipantPopUpMode;
    participants: IParticipantWithSchedules[];
    rooms: IRoom[];
    participant?: IParticipantWithSchedules;
    account?: IAccount;
    onClose: () => void;
    setParticipants?: (value: IParticipantWithSchedules[]) => void;
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
    const [scheduleInputValue, setScheduleInputValue] = useState("");
    const [toggleScheduleScreen, setToggleScheduleScreen] = useState(false);
    const [scedules, setScedules] = useState<ISchedule[]>([]);
    const [currentScedule, setCurrentScedule] = useState<ISchedule>();

    const isInfo = mode === "info";

    const service: ParticipantsService = new ParticipantsService();

    useEffect(() => {
        if (mode !== "add") {
            setScedules(participants.find(p => p.id === currentParticipant.id).schedules);
        }

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
            if (error.length > 0) {
                setError(error);
                return;
            }
            const participantFromDB = await service.findParticipant(
                ["firstname", currentParticipant.firstname],
                ["lastname", currentParticipant.lastname],
            );
            const errors = (
                await Promise.all(
                    scedules.map(scedule => service.createScedule({...scedule, participant: participantFromDB.id})),
                )
            ).flat();
            if (errors.length > 0) {
                setError(errors.flatMap(err => err));
                await service.deleteAccount(participantFromDB.account);
                return;
            }
        } else if (mode === "edit") {
            if (password !== account.password) {
                const error = await service.updateAccount(["id", account.id], ["password", password]);
                if (error.length > 0) {
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

            if (error.length > 0) {
                setError(error);
                return;
            }
        }

        await service.getParticipants().then(participants => {
            service.getScedules().then(schedules => {
                setParticipants(
                    participants.map(p => {
                        const schedule = schedules.filter(s => s.participant === p.id);
                        return {...p, schedules: schedule};
                    }),
                );
            });
        });
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
                        options={scedules.map(scedule => ({label: scedule.name, value: scedule.name}))}
                        inputValue={scheduleInputValue}
                        value={currentScedule?.name}
                        onMenuOpen={() => setSelectPlaceholder("")}
                        onMenuClose={() => setSelectPlaceholder("naam van schema...")}
                        onInputChange={(newValue, actionMeta) => {
                            if (actionMeta.action === "input-change") {
                                setScheduleInputValue(newValue);
                                setCurrentScedule({...currentScedule, name: newValue});
                            }
                        }}
                        onChange={value => {
                            setCurrentScedule(scedules.find(scedule => scedule.name === value));
                            setScheduleInputValue("");
                            setToggleScheduleScreen(true);
                        }}
                    />
                    <div className="mt-auto">
                        {currentScedule?.name && !isInfo && !toggleScheduleScreen && (
                            <Button onClick={() => setToggleScheduleScreen(true)}>Schema aanmaken</Button>
                        )}
                    </div>
                    {toggleScheduleScreen && (
                        <>
                            <div className="flex flex-col py-5">
                                <label htmlFor="startDate">start datum</label>
                                <input
                                    type="datetime-local"
                                    value={toDateString(currentScedule.startDate)}
                                    onChange={item => {
                                        setCurrentScedule({
                                            ...currentScedule,
                                            startDate: fromDateString(item.target.value),
                                        });
                                    }}
                                    id="startDate"
                                    name="startDate"></input>
                            </div>
                            <div className="flex flex-col py-5">
                                <label htmlFor="endDate">eind datum</label>
                                <input
                                    type="datetime-local"
                                    id="endDate"
                                    name="endDate"
                                    value={toDateString(currentScedule.endDate)}
                                    onChange={item => {
                                        setCurrentScedule({
                                            ...currentScedule,
                                            endDate: fromDateString(item.target.value),
                                        });
                                    }}></input>
                            </div>
                        </>
                    )}
                    {toggleScheduleScreen && (
                        <>
                            <div className="col-span-full">
                                <FloorPlans
                                    participants={participants}
                                    rooms={rooms}
                                    height="h-42"
                                    popupPropsExtra={{
                                        currentScedule: currentScedule,
                                        setCurrentScedule: setCurrentScedule,
                                    }}
                                    PopUpContent={ParticipantpopUpFloorplans}></FloorPlans>
                            </div>
                            <Button
                                onClick={() => {
                                    setToggleScheduleScreen(false);
                                    setCurrentScedule(undefined);
                                    setScheduleInputValue("");
                                }}>
                                {isInfo ? "Sluiten" : "Annuleren"}
                            </Button>
                            {!isInfo && (
                                <Button
                                    onClick={() => {
                                        setToggleScheduleScreen(false);
                                        const location = scedules.findIndex(s => s.name === currentScedule.name);
                                        if (location === -1) scedules.push(currentScedule);
                                        else scedules[location] = currentScedule;
                                        setScedules([...scedules]);
                                        setCurrentScedule(undefined);
                                        setScheduleInputValue("");
                                    }}>
                                    {mode === "add" ? "Schema oplsaan" : "Schema bewerken"}
                                </Button>
                            )}
                        </>
                    )}
                </div>,
            ]}
            button={
                <Button
                    onClick={async () => {
                        isInfo ? onClose() : await save();
                    }}>
                    {isInfo ? "sluiten" : mode === "edit" ? "Bewerken" : "Opslaan"}
                </Button>
            }
        />
    );
}

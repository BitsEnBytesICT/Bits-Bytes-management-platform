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
    const [schedules, setSchedules] = useState<ISchedule[]>([]);
    const [currentScedule, setCurrentScedule] = useState<ISchedule>();
    const [isAddingSchedule, setIsAddingSchedule] = useState(false);

    const isInfo = mode === "info";

    const service: ParticipantsService = new ParticipantsService();

    useEffect(() => {
        if (mode !== "add") {
            setSchedules([...participants.find(p => p.id === currentParticipant.id).schedules]);
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
                    schedules.map(scedule => service.createScedule({...scedule, participant: participantFromDB.id})),
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

            if (updatedFields.length > 0) {
                const error = await service.updateParticipant(
                    ["id", currentParticipant.id],
                    ...(updatedFields as KeyValuePair<IParticipant>[]),
                );

                if (error.length > 0) {
                    setError(error);
                    return;
                }
            }

            const newSchedules = schedules.splice(currentParticipant.schedules.length);
            const errors = (
                await Promise.all(
                    newSchedules.map(scedule =>
                        service.createScedule({...scedule, participant: currentParticipant.id}),
                    ),
                )
            ).flat();
            if (errors.length > 0) {
                setError(errors.flatMap(err => err));
                return;
            }

            setSchedules([...schedules.splice(0, currentParticipant.schedules.length)]);
            if (schedules.length > 0) {
                const updatedFieldsSchedules = schedules.map((scedule, index) =>
                    (Object.keys(scedule) as Array<keyof ISchedule>)
                        .filter(key => scedule[key] !== currentParticipant.schedules[index][key])
                        .map(key => [key, scedule[key]]),
                );

                if (updatedFieldsSchedules.some(fields => fields.length > 0)) {
                    const errors = (
                        await Promise.all(
                            schedules.map((scedule, index) =>
                                updatedFieldsSchedules[index].length === 0
                                    ? []
                                    : service.updateScedule(
                                          ["id", scedule.id],
                                          ...(updatedFieldsSchedules[index] as KeyValuePair<ISchedule>[]),
                                      ),
                            ),
                        )
                    ).flat();
                    if (errors.length > 0) {
                        setError(errors);
                        return;
                    }
                }
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
                        options={schedules.map(scedule => ({label: scedule.name, value: scedule.name}))}
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
                            setCurrentScedule(schedules.find(scedule => scedule.name === value));
                            setScheduleInputValue("");
                            setToggleScheduleScreen(true);
                        }}
                    />
                    <div className="mt-auto">
                        {currentScedule?.name && !isInfo && !isAddingSchedule && (
                            <Button
                                onClick={() => {
                                    if (!isAddingSchedule && !toggleScheduleScreen) {
                                        setToggleScheduleScreen(true);
                                        setIsAddingSchedule(true);
                                        return;
                                    }

                                    setToggleScheduleScreen(false);
                                    setIsAddingSchedule(false);
                                    setCurrentScedule(undefined);
                                    setScheduleInputValue("");
                                }}>
                                {!isAddingSchedule && !toggleScheduleScreen ? "Schema aanmaken" : "Schema sluiten"}
                            </Button>
                        )}
                    </div>
                    {toggleScheduleScreen && (
                        <>
                            <div className="flex flex-col py-5">
                                <Input
                                    id="startDate"
                                    label="vanaf"
                                    type="datetime-local"
                                    required={true}
                                    value={toDateString(currentScedule.startDate)}
                                    onChange={value => {
                                        console.log(value);
                                        setCurrentScedule({
                                            ...currentScedule,
                                            startDate: fromDateString(value),
                                        });
                                    }}></Input>
                            </div>
                            <div className="flex flex-col py-5">
                                <Input
                                    id="endDate"
                                    type="datetime-local"
                                    label="tot en met"
                                    value={toDateString(currentScedule.endDate)}
                                    onChange={value => {
                                        setCurrentScedule({
                                            ...currentScedule,
                                            endDate: fromDateString(value),
                                        });
                                    }}></Input>
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
                                    PopUpContent={!isInfo ? ParticipantpopUpFloorplans : undefined}
                                    currentEditedScedule={currentScedule}></FloorPlans>
                            </div>
                            <Button
                                onClick={async () => {
                                    if (!isAddingSchedule) await service.deleteScedule(currentScedule.id);

                                    setToggleScheduleScreen(false);
                                    setCurrentScedule(undefined);
                                    setScheduleInputValue("");
                                    setIsAddingSchedule(false);
                                }}>
                                {isInfo ? "Sluiten" : isAddingSchedule ? "Annuleren" : "verwijderen"}
                            </Button>
                            {!isInfo && (
                                <Button
                                    onClick={() => {
                                        if (!currentScedule.startDate) return;
                                        setToggleScheduleScreen(false);
                                        const location = schedules.findIndex(s => s.name === currentScedule.name);
                                        if (location === -1) schedules.push(currentScedule);
                                        else schedules[location] = currentScedule;
                                        setSchedules([...schedules]);
                                        setCurrentScedule(undefined);
                                        setScheduleInputValue("");
                                        setIsAddingSchedule(false);
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

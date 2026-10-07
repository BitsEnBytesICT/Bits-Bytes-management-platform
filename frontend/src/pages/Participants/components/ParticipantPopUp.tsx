import {useEffect, useState} from "react";
import Button from "../../../common/components/Button";
import Input from "../../../common/components/Input";
import PopUp from "../../../common/components/PopUp";

import {IconCalendarAfter, IconCalendarBefore, IconDelete, IconEdit} from "../../../assets";

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
    setParticipants?: React.Dispatch<React.SetStateAction<IParticipantWithSchedules[]>>;
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
    const [schedules, setSchedules] = useState<ISchedule[]>([]);
    const [currentScedule, setCurrentScedule] = useState<ISchedule>();

    const isInfo = mode === "info";
    const isEditingSchedule = !isInfo && Boolean(currentScedule);

    const service: ParticipantsService = new ParticipantsService();

    useEffect(() => {
        if (mode !== "add") setSchedules([...participant.schedules]);
    }, [participant]);

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

    function openScheduleForm(index?: number) {
        setCurrentScedule(
            index === undefined
                ? ({name: "", startDate: new Date(), participant: currentParticipant?.id} as ISchedule)
                : schedules[index],
        );
    }

    function closeScheduleForm() {
        setCurrentScedule(undefined);
    }

    function saveSchedule() {
        if (!currentScedule.name || !currentScedule.startDate) return;

        if (
            schedules.filter(
                s =>
                    (!s.endDate || s.endDate.getTime() > currentScedule.startDate.getTime()) &&
                    s.id !== currentScedule.id &&
                    ((s.monMorning != null && currentScedule.monMorning != null) ||
                        (s.monEvening != null && currentScedule.monEvening != null) ||
                        (s.thuesMorning != null && currentScedule.thuesMorning != null) ||
                        (s.thuesEvening != null && currentScedule.thuesEvening != null) ||
                        (s.wedMorning != null && currentScedule.wedMorning != null) ||
                        (s.wedEvening != null && currentScedule.wedEvening != null) ||
                        (s.thursMorning != null && currentScedule.thursMorning != null) ||
                        (s.thursEvening != null && currentScedule.thursEvening != null) ||
                        (s.friMorning != null && currentScedule.friMorning != null) ||
                        (s.friEvening != null && currentScedule.friEvening != null)),
            ).length > 0
        )
            return;

        const index = schedules.findIndex(scedule => scedule.name === currentScedule.name);
        if (index === -1) schedules.push({...currentScedule});
        else schedules[index] = {...currentScedule};

        setSchedules([...schedules]);
        closeScheduleForm();
    }

    async function deleteSchedule(index: number) {
        const scedule = schedules[index];
        setSchedules(schedules.filter((_, i) => i !== index));
        if (scedule.id) await service.deleteScedule(scedule.id);
    }

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

            const newSchedules = schedules.filter(scedule => scedule.id == null);
            if (newSchedules.length > 0) {
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
            }

            const existingSchedules = schedules.filter(scedule => scedule.id != null);
            const errors = (
                await Promise.all(
                    existingSchedules.map(scedule => {
                        const originalSchedule = participant.schedules.find(original => original.id === scedule.id);
                        if (!originalSchedule) return [];

                        const updatedFields = (Object.keys(scedule) as Array<keyof ISchedule>)
                            .filter(key => scedule[key] !== originalSchedule[key])
                            .map(key => [key, scedule[key]]);

                        return updatedFields.length === 0
                            ? []
                            : service.updateScedule(
                                  ["id", scedule.id],
                                  ...(updatedFields as KeyValuePair<ISchedule>[]),
                              );
                    }),
                )
            ).flat();
            if (errors.length > 0) {
                setError(errors);
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
            onPrevious={currentScedule ? closeScheduleForm : undefined}
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
                <div className="flex flex-col justify-between grow">
                    {currentScedule ? (
                        <div className="flex flex-col gap-7">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <div className="col-span-2">
                                    <Input
                                        key={currentScedule.id ?? "new"}
                                        id="scheduleName"
                                        type="text"
                                        label="Naam"
                                        required
                                        readOnly={isInfo}
                                        placeholder="Naam van het schema"
                                        value={currentScedule.name}
                                        onChange={value => setCurrentScedule({...currentScedule, name: value})}
                                    />
                                </div>

                                <Input
                                    key={`startDate-${currentScedule.id ?? "new"}`}
                                    id="startDate"
                                    type="datetime-local"
                                    label="Vanaf"
                                    required
                                    readOnly={isInfo}
                                    value={toDateString(currentScedule.startDate)}
                                    icon={IconCalendarAfter}
                                    max={toDateString(currentScedule.endDate) || undefined}
                                    onChange={value =>
                                        setCurrentScedule({...currentScedule, startDate: fromDateString(value)})
                                    }
                                />

                                <Input
                                    key={`endDate-${currentScedule.id ?? "new"}`}
                                    id="endDate"
                                    type="datetime-local"
                                    label="Tot en met"
                                    readOnly={isInfo}
                                    value={toDateString(currentScedule.endDate)}
                                    icon={IconCalendarBefore}
                                    min={toDateString(currentScedule.startDate) || undefined}
                                    onChange={value =>
                                        setCurrentScedule({...currentScedule, endDate: fromDateString(value)})
                                    }
                                />
                            </div>

                            <FloorPlans
                                participants={participants}
                                setParticipants={setParticipants}
                                rooms={rooms}
                                height="h-42"
                                stacked
                                popupPropsExtra={{
                                    currentScedule: currentScedule,
                                    setCurrentScedule: setCurrentScedule,
                                    currentParticipant: currentParticipant,
                                }}
                                PopUpContent={!isInfo ? ParticipantpopUpFloorplans : undefined}
                                currentEditedScedule={currentScedule}></FloorPlans>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-3 max-h-100 overflow-auto">
                                {schedules.map((scedule, index) => (
                                    <div
                                        key={scedule.id ?? scedule.name}
                                        className="px-[15px] py-3 flex flex-row gap-4 items-center bg-(--color-offwhite)
                                            rounded-xl
                                            shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-black)_5%,transparent)]">
                                        <span
                                            className="min-w-0 grow font-semibold text-(--color-darkblue) truncate
                                                select-none">
                                            {scedule.name}
                                        </span>

                                        <img
                                            onClick={() => openScheduleForm(index)}
                                            src={IconEdit}
                                            title="Aanpassen"
                                            className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
                                        />

                                        {!isInfo && (
                                            <img
                                                onClick={() => deleteSchedule(index)}
                                                src={IconDelete}
                                                title="Verwijderen"
                                                className="shrink-0 cursor-pointer select-none [-webkit-user-drag:none]"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {!isInfo && <Button onClick={() => openScheduleForm()}>Schema toevoegen</Button>}
                        </>
                    )}
                </div>,
            ]}
            button={
                <Button
                    onClick={async () => {
                        if (isEditingSchedule) return saveSchedule();
                        isInfo ? onClose() : await save();
                    }}>
                    {isEditingSchedule ? "Opslaan" : isInfo ? "sluiten" : mode === "edit" ? "Bewerken" : "Opslaan"}
                </Button>
            }
        />
    );
}

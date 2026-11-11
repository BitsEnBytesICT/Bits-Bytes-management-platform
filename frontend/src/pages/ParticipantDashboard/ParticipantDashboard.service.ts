import {fromDateString} from "../../common/helperFunctions";
import http from "../../common/http";

import type {IParticipant, IParticipantWithSchedules} from "../../types/compontents/IParticipant";
import type {IRoom} from "../../types/floorPlans/IRoom";
import type ISchedule from "../../types/schedules/ISchedule";
import type IVirtualMachine from "../../types/virtualMachines/IVirtualMachine";

export default class ParticipantDashboardService {
    // Demo data until the virtual machine integration is available.
    getVirtualMachines = (): IVirtualMachine[] => [
        {
            id: 1,
            hostname: "Proxmox-1",
            ipAddress: "10.10.10.10",
            operatingSystem: "Ubuntu 22.04",
            online: true,
            storageUsed: 45,
            storageTotal: 100,
        },
        {
            id: 2,
            hostname: "Proxmox-2",
            ipAddress: "10.10.10.11",
            operatingSystem: "Windows",
            online: false,
            storageUsed: 40,
            storageTotal: 80,
        },
        {
            id: 3,
            hostname: "Proxmox-3",
            ipAddress: "10.10.10.12",
            operatingSystem: "Ubuntu 22.04",
            online: false,
            storageUsed: 45,
            storageTotal: 100,
        },
        {
            id: 4,
            hostname: "Proxmox-4",
            ipAddress: "10.10.10.13",
            operatingSystem: "Ubuntu 22.04",
            online: true,
            storageUsed: 45,
            storageTotal: 100,
        },
    ];

    getRooms = async (): Promise<IRoom[]> => {
        const response = await http("/api/rooms", "POST");
        if (response.status !== 200) throw new Error("De plattegronden konden niet geladen worden.");
        return await response.json();
    };

    getParticipants = async (): Promise<IParticipantWithSchedules[]> => {
        const [participantsResponse, schedulesResponse] = await Promise.all([
            http("/api/participants", "POST"),
            http("/api/schedules", "POST"),
        ]);

        if (participantsResponse.status !== 200 || schedulesResponse.status !== 200)
            throw new Error("De bezetting kon niet geladen worden.");

        const participants: IParticipant[] = await participantsResponse.json();
        const schedules: (Omit<ISchedule, "startDate" | "endDate"> & {startDate: string; endDate?: string})[] =
            await schedulesResponse.json();

        return participants.map(participant => ({
            ...participant,
            schedules: schedules
                .filter(schedule => schedule.participant === participant.id)
                .map(schedule => ({
                    ...schedule,
                    startDate: fromDateString(schedule.startDate),
                    endDate: schedule.endDate ? fromDateString(schedule.endDate) : undefined,
                })),
        }));
    };
}

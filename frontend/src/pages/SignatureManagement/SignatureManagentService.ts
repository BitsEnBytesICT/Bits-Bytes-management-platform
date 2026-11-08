import {toDateString} from "../../common/helperFunctions";
import http from "../../common/http";
import type IAttendance from "../../types/compontents/IAttendance";

export default class SignatureManagementService {
    updateSignature = async (id: number, signature: string): Promise<string[]> => {
        const response = await http("/api/attendance/update", "POST", {
            id: id,
            signature: signature,
        });
        if (response.status === 200) return;
        else return await response.json();
    };

    createSignature = async (attendance: IAttendance): Promise<string[]> => {
        const response = await http("/api/attendance/create", "POST", {
            ...attendance,
            clockinDate: toDateString(attendance.clockinDate),
            clockoutDate: attendance.clockoutDate ? toDateString(attendance.clockoutDate) : undefined,
        });
        if (response.status === 200) return;
        else return await response.json();
    };

    deleteSignatures = async (ids: number[]): Promise<string[]> => {
        const response = await http("/api/attendance/deleteMany", "DELETE", {ids: ids});
        if (response.status === 200) return;
        else return await response.json();
    };
}

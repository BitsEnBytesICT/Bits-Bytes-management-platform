import { ErrorCodes } from '../../types/error/ErrorCodes';
import IError from '../../types/error/IError';
import IDeelnemer from '../../types/deelnemer/IDeelnemer';
import IAttendance from '../../types/attendance/IAttendance';
import ISignature from '../../types/signature/ISignature';
import { ScanResult } from '../../types/scan/ScanResult';
import attendanceValidator from '../../validators/attendance/attendanceValidator';
import signatureValidator from '../../validators/signature/signatureValidator';
import ScanDao from './scan.dao';

export default class ScanService {
    private dao: ScanDao;

    constructor() {
        this.dao = new ScanDao();
    }

    private validateRfid(rfid_uid: string): void {
        if (typeof rfid_uid !== 'string' || rfid_uid.length === 0) {
            throw {
                date: new Date(),
                errorMSG: new Error('rfid_uid is required'),
                code: ErrorCodes.InvalidData,
            } as IError;
        }
    }

    private validateSignature(signature: string): void {
        if (typeof signature !== 'string' || signature.length === 0) {
            throw {
                date: new Date(),
                errorMSG: new Error('signature is required'),
                code: ErrorCodes.InvalidData,
            } as IError;
        }
    }

    processScan(rfid_uid: string): ScanResult {
        this.validateRfid(rfid_uid);

        const deelnemer = this.dao.findDeelnemerByRFID(rfid_uid);

        if (!deelnemer) {
            return {
                success: false,
                action: 'clock_in',
                message: 'Kaart niet geregistreerd',
            };
        }

        const openAttendance = this.dao.findOpenAttendance(deelnemer.id!);

        if (openAttendance) {
            const now = new Date().toISOString();
            const clockin = new Date(openAttendance.clockinDate).getTime();
            const clockout = new Date(now).getTime();
            const durationMinutes = Math.round((clockout - clockin) / 60000);

            const attendanceUpdate: IAttendance = {
                id: openAttendance.id,
                deelnemerID: deelnemer.id!,
                clockinDate: openAttendance.clockinDate,
                clockoutDate: now,
                workDuration: durationMinutes,
            };

            const validationResult = attendanceValidator(attendanceUpdate);
            if (validationResult.find((r) => r.kind === 'error') === undefined) {
                this.dao.updateAttendanceClockOut(attendanceUpdate);
                this.dao.setDeelnemerClockedIn(deelnemer.id!, 0);
            } else {
                const errors = validationResult
                    .filter((r) => r.kind === 'error')
                    .map((error) => error.errorMSG);
                throw errors;
            }

            return {
                success: true,
                action: 'clock_out',
                message: 'Tot ziens, ' + deelnemer.firstname + '!',
                user: {
                    name: deelnemer.firstname + ' ' + deelnemer.lastname,
                    department: deelnemer.organisation,
                },
            };
        }

        return {
            success: true,
            action: 'clock_in',
            message: 'Welkom, ' + deelnemer.firstname + '!',
            user: {
                name: deelnemer.firstname + ' ' + deelnemer.lastname,
                department: deelnemer.organisation,
            },
        };
    }

    processClockInWithSignature(rfid_uid: string, signature: string): void {
        this.validateRfid(rfid_uid);
        this.validateSignature(signature);

        const deelnemer = this.dao.findDeelnemerByRFID(rfid_uid);
        if (!deelnemer) {
            throw {
                date: new Date(),
                errorMSG: new Error('Kaart niet geregistreerd'),
                code: ErrorCodes.InvalidData,
            } as IError;
        }

        const now = new Date().toISOString();
        const attendance: IAttendance = {
            deelnemerID: deelnemer.id!,
            clockinDate: now,
        };

        const attendanceCheck = attendanceValidator(attendance);
        if (attendanceCheck.find((r) => r.kind === 'error') !== undefined) {
            const errors = attendanceCheck
                .filter((r) => r.kind === 'error')
                .map((error) => error.errorMSG);
            throw errors;
        }

        this.dao.createAttendance(attendance);
        this.dao.setDeelnemerClockedIn(deelnemer.id!, 1);

        const sig: ISignature = {
            deelnemerID: deelnemer.id!,
            date: now,
            signature,
        };

        const sigCheck = signatureValidator(sig);
        if (sigCheck.find((r) => r.kind === 'error') !== undefined) {
            const errors = sigCheck
                .filter((r) => r.kind === 'error')
                .map((error) => error.errorMSG);
            throw errors;
        }

        this.dao.createSignature(sig);
    }

    fetchLast30Days(rfid_uid: string): string[] {
        this.validateRfid(rfid_uid);

        const deelnemer = this.dao.findDeelnemerByRFID(rfid_uid);
        if (!deelnemer) return [];

        return this.dao.getAttendanceLast30Days(deelnemer.id!);
    }
}

import { ErrorCodes } from '../../types/error/ErrorCodes';
import IError from '../../types/error/IError';
import IAttendance from '../../types/attendance/IAttendance';
import ISignature from '../../types/signature/ISignature';
import IScanResult from '../../types/scan/IScanResult';
import ScanDao from './attendance.dao';
import DeelnemerService from '../deelnemers/deelnemers.service';
import { KeyValuePair, ValidatorTuple } from '../../common/Validator';
import SignatureService from '../Signatures/signatures.service';
import serviceBase from '../../common/serviceBase';
import { attendanceValidator, attendanceValidatorFunctors, partialAttendanceValidator } from '../../validators/attendanceValidator';

export default class AttendanceService implements serviceBase<IAttendance> {
    dao: ScanDao;
    private deelnemerService: DeelnemerService;
    private signatureService: SignatureService;

    constructor() {
        this.dao = new ScanDao();
        this.deelnemerService = new DeelnemerService();
        this.signatureService = new SignatureService();
    }

    create(...args: any[]): void {
        throw new Error('Method not implemented.');
    }

    update(where: KeyValuePair<IAttendance>, ...values: KeyValuePair<IAttendance>[]): void {
        const validatorFunctors = values.map((item) => 
                    [item[0], attendanceValidatorFunctors[item[0]][0], attendanceValidatorFunctors[item[0]][1]] as ValidatorTuple<IAttendance>);
        
        const validationResult = partialAttendanceValidator(Object.fromEntries(values), validatorFunctors);
        const errors = validationResult.filter((r) => r.kind === "error").map((r) => r.errorMSG);
        if (errors.length > 0) throw errors;

        this.dao.update(where, ...values);
    }

    delete(...args: any[]): void {
        throw new Error('Method not implemented.');
    }
    
    async list(...args: any[]): Promise<IAttendance[]> {
        throw new Error('Method not implemented.');
    }

    async findOne(...where: KeyValuePair<IAttendance>[]): Promise<IAttendance> {
        throw new Error('Method not implemented.');
    }
        
    scan = async(rfid_uid: string): Promise<IScanResult> => {
        
        this.validateRfid(rfid_uid);

        const deelnemer = await this.deelnemerService.findOne(["rfid", rfid_uid], ["active", 1]);

        if (!deelnemer) {
            return {
                success: false,
                action: 'clock_in',
                message: 'Kaart niet geregistreerd',
            };
        }

        const openAttendance = await this.dao.findOne(["deelnemerID", deelnemer.id!], ["clockoutDate", undefined]);

        if (openAttendance) {
            const now = new Date().toISOString();
            const clockin = new Date(openAttendance.clockinDate).getTime();
            const clockout = new Date(now).getTime();
            const durationMinutes = Math.round((clockout - clockin) / 60000);

            const attendanceUpdate: IAttendance = {
                deelnemerID: deelnemer.id!,
                clockinDate: openAttendance.clockinDate,
                clockoutDate: now,
                workDuration: durationMinutes,
            };

            const validationResult = attendanceValidator(attendanceUpdate);
            if (validationResult.find((r) => r.kind === 'error') === undefined) {
                await this.dao.update(["id", openAttendance.id], ...Object.entries(attendanceUpdate) as KeyValuePair<IAttendance>[]);
                await this.deelnemerService.update(["id", deelnemer.id!], ["clockedin", 0]);
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

    async processClockInWithSignature(rfid_uid: string, signature: string) {
        this.validateRfid(rfid_uid);
        this.validateSignature(signature);

        const deelnemer = await this.deelnemerService.findOne(["rfid", rfid_uid], ["active", 1]);

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

        await this.dao.create(attendance);
        await this.deelnemerService.update(["id", deelnemer.id!], ["clockedin", 1]);

        const sig: ISignature = {
            deelnemerID: deelnemer.id!,
            date: now,
            signature,
        };

        await this.signatureService.create(sig);
    }

    async fetchLast30Days(rfid_uid: string): Promise<string[]> {
        this.validateRfid(rfid_uid);

        const deelnemer = await this.deelnemerService.findOne(["rfid", rfid_uid], ["active", 1]);
        
        if (!deelnemer) return [];

        return await this.dao.getAttendanceLast30Days(deelnemer.id!);
    }
}
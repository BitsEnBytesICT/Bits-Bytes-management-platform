import { ErrorCodes } from '../../types/error/ErrorCodes';
import IError from '../../types/error/IError';
import IAttendance from '../../types/attendance/IAttendance';
import ISignature from '../../types/signature/ISignature';
import IScanResult from '../../types/scan/IScanResult';
import ScanDao from './attendance.dao';
import ParticipantService from '../participants/participants.service';
import { KeyValuePair, ValidatorTuple } from '../../common/Validator';
import SignatureService from '../signatures/signatures.service';
import serviceBase from '../../common/serviceBase';
import { attendanceValidator, attendanceValidatorFunctors, partialAttendanceValidator } from '../../validators/attendanceValidator';

export default class AttendanceService implements serviceBase<IAttendance> {
    dao: ScanDao;
    private participantService: ParticipantService;
    private signatureService: SignatureService;

    constructor() {
        this.dao = new ScanDao();
        this.participantService = new ParticipantService();
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

        const participant = await this.participantService.findOne(["rfid", rfid_uid], ["active", 1]);

        if (!participant) {
            return {
                success: false,
                action: 'clock_in',
                message: 'Kaart niet geregistreerd',
            };
        }

        const openAttendance = await this.dao.findOne(["participantID", participant.id!], ["clockoutDate", undefined]);

        if (openAttendance) {
            const now = new Date().toISOString();
            const clockin = new Date(openAttendance.clockinDate).getTime();
            const clockout = new Date(now).getTime();
            const durationMinutes = Math.round((clockout - clockin) / 60000);

            const attendanceUpdate: IAttendance = {
                participantID: participant.id!,
                clockinDate: openAttendance.clockinDate,
                clockoutDate: now,
                workDuration: durationMinutes,
            };

            const validationResult = attendanceValidator(attendanceUpdate);
            if (validationResult.find((r) => r.kind === 'error') === undefined) {
                await this.dao.update(["id", openAttendance.id], ...Object.entries(attendanceUpdate) as KeyValuePair<IAttendance>[]);
                await this.participantService.update(["id", participant.id!], ["clockedin", 0]);
            } else {
                const errors = validationResult
                    .filter((r) => r.kind === 'error')
                    .map((error) => error.errorMSG);
                throw errors;
            }

            return {
                success: true,
                action: 'clock_out',
                message: 'Tot ziens, ' + participant.firstname + '!',
                user: {
                    name: participant.firstname + ' ' + participant.lastname,
                    department: participant.organisation,
                },
            };
        }

        return {
            success: true,
            action: 'clock_in',
            message: 'Welkom, ' + participant.firstname + '!',
            user: {
                name: participant.firstname + ' ' + participant.lastname,
                department: participant.organisation,
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

        const participant = await this.participantService.findOne(["rfid", rfid_uid], ["active", 1]);

        if (!participant) {
            throw {
                date: new Date(),
                errorMSG: new Error('Kaart niet geregistreerd'),
                code: ErrorCodes.InvalidData,
            } as IError;
        }

        const now = new Date().toISOString();
        const attendance: IAttendance = {
            participantID: participant.id!,
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
        await this.participantService.update(["id", participant.id!], ["clockedin", 1]);

        const sig: ISignature = {
            participantID: participant.id!,
            date: now,
            signature,
        };

        await this.signatureService.create(sig);
    }

    async fetchLast30Days(rfid_uid: string): Promise<string[]> {
        this.validateRfid(rfid_uid);

        const participant = await this.participantService.findOne(["rfid", rfid_uid], ["active", 1]);
        
        if (!participant) return [];

        return await this.dao.getAttendanceLast30Days(participant.id!);
    }
}
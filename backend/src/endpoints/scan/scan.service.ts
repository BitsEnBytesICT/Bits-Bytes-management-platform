import ScanDao from './scan.dao';

export interface ScanResult {
    success: boolean;
    action: string;
    message: string;
    user: {
        name: string;
        department: string;
    };
}

export default class ScanService {
    private dao: ScanDao;

    constructor() {
        this.dao = new ScanDao();
    }

    processScan(rfid_uid: string): ScanResult {
        const deelnemer = this.dao.findDeelnemerByRFID(rfid_uid);

        if (!deelnemer) {
            return {
                success: false,
                action: 'clock_in',
                message: 'Kaart niet geregistreerd',
                user: { name: '', department: '' },
            };
        }

        const openAttendance = this.dao.findOpenAttendance(deelnemer.id!);

        if (openAttendance) {
            const now = new Date().toISOString();
            const clockin = new Date(openAttendance.clockinDate).getTime();
            const clockout = new Date(now).getTime();
            const durationMinutes = Math.round((clockout - clockin) / 60000);
            this.dao.updateAttendanceClockOut(openAttendance.id!, now, durationMinutes);
            this.dao.setDeelnemerClockedIn(deelnemer.id!, 0);

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

    processClockInWithSignature(rfid_uid: string, signature: string): boolean {
        const deelnemer = this.dao.findDeelnemerByRFID(rfid_uid);
        if (!deelnemer) return false;

        const now = new Date().toISOString();
        this.dao.createAttendance(deelnemer.id!, now);
        this.dao.setDeelnemerClockedIn(deelnemer.id!, 1);
        this.dao.createSignature(deelnemer.id!, now, signature);

        return true;
    }

    fetchLast30Days(rfid_uid: string): string[] {
        const deelnemer = this.dao.findDeelnemerByRFID(rfid_uid);
        if (!deelnemer) return [];

        return this.dao.getAttendanceLast30Days(deelnemer.id!);
    }
}

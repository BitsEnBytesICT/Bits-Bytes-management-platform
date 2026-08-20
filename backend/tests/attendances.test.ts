import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import AttendanceService from "../src/endpoints/attendances/attendance.service";
import ParticipantService from "../src/endpoints/participants/participants.service";
import { dbQuery } from "../src/common/db";
import { getCurrentDate } from "../src/common/dateFunctions";
import { runMigrations } from "../src/common/migrationsLoader";
import { setupDatabase } from "../src/setupDatabases";

describe("AttendanceService", () => {
    const service = new AttendanceService();
    const participantService = new ParticipantService();
    const rfid = "11F3EF12";
    const signature = "data:image/png;base64,signature";

    before(async () => {
        process.env.DATABASE_TYPE = "sqllite";
        process.env.NODE_ENV = "DEVELOPMENT";
        process.env.ENCRYPTION_KEY = "b6424bcf211217cc99e17c27f1d36dafbe6ab3db75c65b3a10c3ab8162d1e2cd";

        try {
            await dbQuery("DELETE FROM Attendances");
        } catch {}
        try {
            await runMigrations();
        } catch {}
        try {
            setupDatabase();
        } catch {}

        await dbQuery("DELETE FROM Attendances");
    });

    it("creates an attendance and clocks in the participant", async () => {
        await assert.doesNotReject(async () => {
            await service.create(rfid, signature);
        });

        const attendances = await service.list();
        const participant = await participantService.findOne(["rfid", rfid]);

        assert.equal(attendances.length, 1);
        assert.equal(attendances[0]?.participantID, participant?.id);
        assert.equal(attendances[0]?.signature, signature);
        assert.equal(attendances[0]?.clockoutDate, null);
        assert.equal(participant?.clockedin, 1);
    });

    it("rejects an empty RFID", async () => {
        await assert.rejects(async () => {
            await service.create("", signature);
        });
    });

    it("rejects an empty signature", async () => {
        await assert.rejects(async () => {
            await service.create(rfid, "");
        });
    });

    it("rejects an unknown participant", async () => {
        await assert.rejects(async () => {
            await service.create("UNKNOWN", signature);
        });
    });

    it("returns a failed scan for an unknown participant", async () => {
        assert.deepEqual(await service.scan("UNKNOWN"), {
            success: false,
            action: "clock_in",
            message: "Kaart niet geregistreerd",
        });
    });

    it("clocks out an open attendance returned with a MySQL date", async (context) => {
        const mysqlAttendance = (await service.list())[0]!;
        const originalClockinDate = mysqlAttendance.clockinDate;
        Reflect.set(mysqlAttendance, "clockinDate", new Date(originalClockinDate));
        context.mock.method(service.dao, "findOne", async () => mysqlAttendance);

        const result = await service.scan(rfid);
        const attendance = (await service.list())[0];
        const participant = await participantService.findOne(["rfid", rfid]);

        assert.equal(result.success, true);
        assert.equal(result.action, "clock_out");
        assert.equal(result.message, "Tot ziens, Jan!");
        assert.ok(attendance?.clockoutDate);
        assert.ok(attendance?.workDuration !== null);
        assert.equal(attendance?.participantID, mysqlAttendance.participantID);
        assert.equal(attendance?.clockinDate, originalClockinDate);
        assert.equal(attendance?.signature, signature);
        assert.equal(participant?.clockedin, 0);
    });

    it("returns clock-in information when no attendance is open", async () => {
        assert.deepEqual(await service.scan(rfid), {
            success: true,
            action: "clock_in",
            message: "Welkom, Jan!",
            user: {
                name: "Jan de Vries",
                department: "WMO",
            },
        });
    });

    it("updates an attendance", async () => {
        const attendance = (await service.list())[0];

        await assert.doesNotReject(async () => {
            await service.update(["id", attendance?.id], ["signature", "updated-signature"]);
        });

        const updatedAttendance = (await service.list())[0];
        assert.equal(updatedAttendance?.signature, "updated-signature");
    });

    it("rejects an invalid attendance update", async () => {
        const attendance = (await service.list())[0];

        await assert.rejects(async () => {
            await service.update(["id", attendance?.id], ["workDuration", -1]);
        });
    });

    it("returns attendance dates from the last 30 days", async () => {
        assert.deepEqual(await service.fetchLast30Days(rfid), [getCurrentDate().slice(0, 10)]);
        assert.deepEqual(await service.fetchLast30Days("UNKNOWN"), []);
    });

    it("deletes an attendance", async () => {
        const attendance = (await service.list())[0];

        await service.delete(["id", attendance?.id]);

        assert.deepEqual(await service.list(), []);
    });
});

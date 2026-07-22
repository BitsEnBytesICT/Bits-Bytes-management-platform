import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { setupDatabase } from "../src/setupDatabases";
import ParticipantService from "../src/endpoints/participants/participants.service";
import { ParticipantValidator } from "../src/validators/participantValidator";
import IParticipant from "../src/types/participant/IParticipant";
import { runMigrations } from "../src/common/migrationsLoader";

describe("ParticipantService", () => {
    const service = new ParticipantService();

    before(async () => {
        process.env.DATABASE_TYPE = "sqllite";
        process.env.NODE_ENV = "DEVELOPMENT";
        process.env.ENCRYPTION_KEY = "b6424bcf211217cc99e17c27f1d36dafbe6ab3db75c65b3a10c3ab8162d1e2cd";

        try {
            await runMigrations();
        } catch {}
        try {
            setupDatabase();
        } catch {}
    });

    it("count returns the total number of participants", async () => {
        const count = await service.count();
        assert.equal(count, 3);
    });

    it("countPresent returns only the clocked-in participants", async () => {
        const count = await service.countPresent();
        assert.equal(count, 1);
    });

    it("list returns every participant with the expected fields", async () => {
        const participants = await service.list();

        assert.equal(participants.length, 3);
        assert.ok(participants.some((p) => p.firstname === "Maria" && p.clockedin === 1));
    });

    it("create new participant", async () => {
        const participant: IParticipant = {
            firstname: "participant",
            lastname: "participant",
            organisation: "test",
            account: 3,
            rfid: "AAAA",
            createdAt: new Date().toDateString(),
            active: 1
        }

        await assert.doesNotReject(async () => {
            await service.create(participant);
        });
    });

    it("update participant", async () => {
        await assert.doesNotReject(async () => {
            service.update(["rfid", "AAAA"], ["firstname", "participantUpdated"], ["lastname", "participantUpdated"]);
        });

        const updatedParticipant = await service.findOne(["rfid", "AAAA"]);

        assert.equal(updatedParticipant?.firstname, "participantUpdated");
        assert.equal(updatedParticipant?.lastname, "participantUpdated");
    });

    it("delete participant", async () => {
        const participant = await service.findOne(["rfid", "AAAA"]);
        await assert.doesNotReject(async () => {
            service.delete(participant?.id as number);
        });
        
        assert.equal(await service.findOne(["rfid", "AAAA"]), undefined);
    });
});

describe("ParticipantValidator", () => {
    const validParticipant: IParticipant = {
        id: 1,
        firstname: "Jan",
        lastname: "de Vries",
        organisation: "IT Afdeling",
        account: 1,
        rfid: "11F3EF12",
        createdAt: new Date().toISOString(),
        active: 1,
        clockedin: 0,
        financing: "Develop",
    };

    it("accepts a fully valid participant", () => {
        const results = ParticipantValidator(validParticipant);
        assert.ok(results.every((r) => r.kind === "success"));
    });

    it("rejects empty and out-of-range values", () => {
        const results = ParticipantValidator({
            id: -1,
            firstname: "",
            lastname: "",
            organisation: "",
            account: -1,
            rfid: "",
            createdAt: "",
            active: -1,
            clockedin: -1,
            financing: "",
        });

        assert.ok(results.every((r) => r.kind === "error"));
    });

    it("rejects an invalid date format", () => {
        const results = ParticipantValidator({ ...validParticipant, createdAt: "35-16-2020" });
        assert.equal(results.find((r) => r.key === "createdAt")?.kind, "error");
    });

    it("accepts a participant without the optional id and clockedin fields", () => {
        const { id, clockedin, ...rest } = validParticipant;
        const results = ParticipantValidator(rest as IParticipant);
        assert.ok(results.every((r) => r.kind === "success"));
    });

    it("accepts id and account when they are exactly 0", () => {
        const results = ParticipantValidator({ ...validParticipant, id: 0, account: 0 });
        assert.equal(results.find((r) => r.key === "id")?.kind, "success");
        assert.equal(results.find((r) => r.key === "account")?.kind, "success");
    });

    it("rejects a negative id and account", () => {
        const results = ParticipantValidator({ ...validParticipant, id: -1, account: -1 });
        assert.equal(results.find((r) => r.key === "id")?.kind, "error");
        assert.equal(results.find((r) => r.key === "account")?.kind, "error");
    });

    it("rejects a non-integer active/clockedin value", () => {
        const results = ParticipantValidator({ ...validParticipant, active: 0.5, clockedin: 0.5 });
        assert.equal(results.find((r) => r.key === "active")?.kind, "error");
        assert.equal(results.find((r) => r.key === "clockedin")?.kind, "error");
    });

    it("accepts a string of exactly 50 characters but rejects 51", () => {
        const fiftyChars = "a".repeat(50);
        const fiftyOneChars = "a".repeat(51);

        const okResults = ParticipantValidator({ ...validParticipant, firstname: fiftyChars });
        const tooLongResults = ParticipantValidator({ ...validParticipant, firstname: fiftyOneChars });

        assert.equal(okResults.find((r) => r.key === "firstname")?.kind, "success");
        assert.equal(tooLongResults.find((r) => r.key === "firstname")?.kind, "error");
    });

    it("accepts a participant with financing left undefined", () => {
        const { financing, ...rest } = validParticipant;
        const results = ParticipantValidator(rest as IParticipant);
        assert.equal(results.find((r) => r.key === "financing")?.kind, "success");
    });
});

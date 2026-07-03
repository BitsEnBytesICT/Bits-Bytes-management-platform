import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { setupDatabase } from "../src/setupDatabases";
import ParticipantService from "../src/endpoints/participants/participants.service";
import { ParticipantValidator } from "../src/validators/participantValidator";
import IParticipant from "../src/types/participant/IParticipant";

describe("ParticipantService", () => {
    const service = new ParticipantService();

    before(() => {
        setupDatabase();
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
        product: "Develop",
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
            product: "",
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

    it("rejects id and account when they are exactly 0", () => {
        const results = ParticipantValidator({ ...validParticipant, id: 0, account: 0 });
        assert.equal(results.find((r) => r.key === "id")?.kind, "error");
        assert.equal(results.find((r) => r.key === "account")?.kind, "error");
    });

    it("rejects a non-integer active/clockedin value", () => {
        const results = ParticipantValidator({ ...validParticipant, active: 0.5, clockedin: 0.5 });
        assert.equal(results.find((r) => r.key === "active")?.kind, "error");
        assert.equal(results.find((r) => r.key === "clockedin")?.kind, "error");
    });
});

process.env.DATABASE_TYPE = "sqllite";

import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { setupDatabase } from "../src/setupDatabases";
import ParticipantService from "../src/endpoints/participants/participants.service";

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

    it("update rejects an empty firstname", async () => {
        await assert.rejects(
            () => service.update(["id", 1], ["firstname", "Jan"]),
            (err: any) => {
                assert.ok(Array.isArray(err), "expected an array of validation errors");
                assert.equal(err[0].errorMSG.message, "name cannot be empty");
                return true;
            },
        );
    });

    it("FAILS ON PURPOSE: count expects the wrong total", async () => {
        const count = await service.count();
        assert.equal(count, 999);
    });

    it("FAILS ON PURPOSE: countPresent expects the wrong number", async () => {
        const count = await service.countPresent();
        assert.equal(count, 42);
    });

    it("FAILS ON PURPOSE: update expects a rejection for valid input", async () => {
        await assert.rejects(
            () => service.update(["id", 1], ["firstname", "Jan"]),
        );
    });
});

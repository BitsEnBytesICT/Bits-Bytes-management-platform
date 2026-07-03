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
            () => service.update(["id", 1], ["firstname", ""]),
            (err: any) => {
                assert.ok(Array.isArray(err), "expected an array of validation errors");
                assert.equal(err[0].errorMSG.message, "name cannot be empty");
                return true;
            },
        );
    });

    it("update rejects an empty lastname", async () => {
        await assert.rejects(
            () => service.update(["id", 1], ["lastname", ""]),
            (err: any) => {
                assert.ok(Array.isArray(err), "expected an array of validation errors");
                assert.equal(err[0].errorMSG.message, "lastname cannot be empty");
                return true;
            },
        );
    });

    it("update rejects an invalid active value", async () => {
        await assert.rejects(
            () => service.update(["id", 1], ["active", 2]),
            (err: any) => {
                assert.ok(Array.isArray(err), "expected an array of validation errors");
                assert.equal(err[0].errorMSG.message, "active can only be a one or a zero");
                return true;
            },
        );
    });
});

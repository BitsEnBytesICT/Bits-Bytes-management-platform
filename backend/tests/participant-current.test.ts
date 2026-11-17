import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { Server } from "node:http";
import { AddressInfo } from "node:net";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { createEnforcer } from "../src/common/casbin";
import { encrypt } from "../src/common/encryptorDecryptor";
import { runMigrations } from "../src/common/migrationsLoader";
import participantRouter from "../src/endpoints/participants/participants.routes";
import ParticipantService from "../src/endpoints/participants/participants.service";
import scheduleRouter from "../src/endpoints/schedules/schedules.routes";
import { setupDatabase } from "../src/setupDatabases";
import { ErrorCodes } from "../src/types/error/ErrorCodes";
import IError from "../src/types/error/IError";
import { IParticipantWithSchedules } from "../src/types/participant/IParticipant";
import { PermissionsList } from "../src/types/permissions/permissionsList";

describe("GET /api/participant/current", () => {
    let server: Server;
    let baseUrl: string;

    function token(username: string, expiresIn = 900): string {
        return jwt.sign(
            { username: encrypt(username) },
            String(process.env.JWT_SECRET),
            { expiresIn },
        );
    }

    function getCurrent(username: string, query = ""): Promise<globalThis.Response> {
        return fetch(`${baseUrl}/api/participant/current${query}`, {
            headers: { Cookie: `login=${token(username)}` },
        });
    }

    before(async () => {
        process.env.NODE_ENV = "DEVELOPMENT";
        process.env.DATABASE_TYPE = "sqllite";
        process.env.JWT_SECRET = "VERYSECURESECRET";
        process.env.ENCRYPTION_KEY = "b6424bcf211217cc99e17c27f1d36dafbe6ab3db75c65b3a10c3ab8162d1e2cd";

        await runMigrations();
        setupDatabase();

        const enforcer = await createEnforcer();
        await enforcer.addPermissionForUser("current-participant-test", PermissionsList.participantCurrent);
        for (const username of ["JanD", "MariaJ", "support"]) {
            await enforcer.deleteRolesForUser(username);
            await enforcer.addRoleForUser(username, "current-participant-test");
        }
        await enforcer.deleteRolesForUser("it");
        await enforcer.addPermissionForUser("current-account-test", PermissionsList.accountCurrent);
        await enforcer.addRoleForUser("it", "current-account-test");

        const app = express();
        app.use(express.json());
        app.use(cookieParser());
        app.use(participantRouter);
        app.use(scheduleRouter);
        app.use((error: IError, _req: Request, res: Response, _next: NextFunction) => {
            res.status(error.code === ErrorCodes.invalidCredentials ? 401 : 500).json(error.errorMSG.message);
        });

        server = app.listen(0, "127.0.0.1");
        await once(server, "listening");
        baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    });

    after(async () => {
        if (server) await new Promise<void>((resolve, reject) => {
            server.close(error => error ? reject(error) : resolve());
        });
    });

    it("returns the linked participant and only their schedules with participant.current permission", async () => {
        const response = await getCurrent("JanD");
        assert.equal(response.status, 200);

        const participant = await response.json() as IParticipantWithSchedules;
        assert.equal(participant.id, 1);
        assert.equal(participant.account, 3);
        assert.equal(participant.firstname, "Jan");
        assert.equal(participant.schedules.length, 1);
        assert.ok(participant.schedules.every(schedule => schedule.participant === participant.id));
        assert.equal(participant.schedules[0]?.name, "Jan - drie ochtenden");
        assert.equal(typeof participant.schedules[0]?.startDate, "string");
        assert.equal("password" in participant, false);
    });

    it("keeps participant and schedule data isolated between accounts", async () => {
        const response = await getCurrent("MariaJ");
        assert.equal(response.status, 200);

        const participant = await response.json() as IParticipantWithSchedules;
        assert.equal(participant.id, 2);
        assert.equal(participant.account, 4);
        assert.equal(participant.firstname, "Maria");
        assert.equal(participant.schedules.length, 1);
        assert.ok(participant.schedules.every(schedule => schedule.participant === participant.id));
        assert.equal(participant.schedules[0]?.name, "Maria - volledige werkweek");
    });

    it("uses the token identity even when another participant is requested in the query", async () => {
        const response = await getCurrent("JanD", "?account=4&participant=2");
        assert.equal(response.status, 200);
        assert.equal((await response.json()).id, 1);
    });

    it("does not grant access to participant or schedule lists", async () => {
        for (const route of ["/api/participants", "/api/schedules"]) {
            const response = await fetch(`${baseUrl}${route}`, {
                method: "POST",
                headers: { Cookie: `login=${token("JanD")}` },
            });
            assert.equal(response.status, 423);
        }
    });

    it("returns JSON null for an account without a linked participant", async () => {
        const response = await getCurrent("support");
        assert.equal(response.status, 200);
        assert.equal(await response.json(), null);
    });

    it("denies access when the account lacks participant.current", async () => {
        const response = await getCurrent("it");
        assert.equal(response.status, 423);
    });

    it("rejects a missing login token", async () => {
        const response = await fetch(`${baseUrl}/api/participant/current`);
        assert.equal(response.status, 401);
    });

    it("rejects a malformed login token", async () => {
        const response = await fetch(`${baseUrl}/api/participant/current`, {
            headers: { Cookie: "login=invalid-token" },
        });
        assert.equal(response.status, 401);
    });

    it("rejects a token signed with a different secret", async () => {
        const forgedToken = jwt.sign({ username: encrypt("JanD") }, "different-secret");
        const response = await fetch(`${baseUrl}/api/participant/current`, {
            headers: { Cookie: `login=${forgedToken}` },
        });
        assert.equal(response.status, 401);
    });

    it("rejects an expired login token", async () => {
        const response = await fetch(`${baseUrl}/api/participant/current`, {
            headers: { Cookie: `login=${token("JanD", -1)}` },
        });
        assert.equal(response.status, 401);
    });

    it("requires a login token even when an API key has permission", async () => {
        const response = await fetch(`${baseUrl}/api/participant/current`, {
            headers: { Authorization: "test-api-key" },
        });
        assert.equal(response.status, 401);
    });

    it("rejects a token whose account no longer exists", async () => {
        await assert.rejects(
            new ParticipantService().current(token("missing-account")),
            (error: IError) => error.code === ErrorCodes.invalidCredentials,
        );
    });
});

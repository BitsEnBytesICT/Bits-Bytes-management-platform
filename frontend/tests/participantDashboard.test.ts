import assert from "node:assert/strict";
import {describe, it} from "node:test";
import ParticipantDashboardService from "../src/pages/ParticipantDashboard/ParticipantDashboard.service.ts";

const service = new ParticipantDashboardService();

describe("participant dashboard shortcuts", () => {
    it("normalizes bare domains while retaining paths, queries and fragments", () => {
        assert.deepEqual(service.validateShortcut("  Mijn kalender  ", "  example.nl/calendar?q=week#today  "), {
            label: "Mijn kalender",
            url: "https://example.nl/calendar?q=week#today",
        });
    });

    it("supports explicit HTTP, HTTPS, internal addresses and development ports", () => {
        for (const url of ["http://10.10.10.10:8080/", "https://example.nl/", "http://intranet/"]) {
            assert.equal(service.normalizeWebsite(url), url);
        }
        assert.equal(service.normalizeWebsite("localhost:8080/help"), "https://localhost:8080/help");
        assert.equal(service.normalizeWebsite("example.nl:8443/"), "https://example.nl:8443/");
    });

    for (const url of [
        "javascript:alert(1)",
        "javascript:123",
        "JaVaScRiPt:alert(1)",
        "data:text/html,<script>alert(1)</script>",
        "file:///C:/test.txt",
        "vbscript:msgbox(1)",
        "mailto:test@example.nl",
        "ftp://example.nl/",
        "https://user:password@example.nl/",
        "https://user@example.nl/",
        "https://example.nl\\@other.nl/",
        "java\nscript:alert(1)",
        "https://exa mple.nl/",
        "https://",
        "",
    ]) {
        it(`rejects unsafe or malformed address ${JSON.stringify(url)}`, () => {
            assert.throws(() => service.normalizeWebsite(url));
        });
    }

    it("rejects blank and overlong names and overlong URLs", () => {
        assert.throws(() => service.validateShortcut("  ", "example.nl"));
        assert.throws(() => service.validateShortcut("a".repeat(51), "example.nl"));
        assert.throws(() => service.normalizeWebsite(`https://example.nl/${"a".repeat(2048)}`));
        assert.equal(service.validateShortcut("a".repeat(50), "example.nl").label.length, 50);
    });

    it("restores only validated records and retains their order", () => {
        const first = {id: "first", label: "Voorbeeld", url: "https://example.nl/"};
        const last = {id: "last", label: "Andere", url: "http://intranet/"};

        assert.deepEqual(
            service.readShortcuts([
                first,
                null,
                {id: "unsafe", label: "Onveilig", url: "javascript:alert(1)"},
                {id: "missing-name", url: "https://example.nl"},
                {id: "first", label: "Duplicaat", url: "https://other.nl"},
                {id: 42, label: "Verkeerd id", url: "https://example.nl"},
                {id: "blank-name", label: " ", url: "https://example.nl"},
                last,
            ]),
            [first, last],
        );
    });

    it("treats invalid storage shapes as an empty list", () => {
        for (const value of [null, undefined, "not an array", 10, {}, {shortcuts: []}]) {
            assert.deepEqual(service.readShortcuts(value), []);
        }
    });

    it("does not carry arbitrary stored fields into the page", () => {
        assert.deepEqual(
            service.readShortcuts([
                {
                    id: "one",
                    label: "Website",
                    url: "example.nl",
                    faviconUrl: "javascript:alert(1)",
                    accountId: 123,
                },
            ]),
            [{id: "one", label: "Website", url: "https://example.nl/"}],
        );
    });

    it("derives the favicon from the origin without including the destination path or query", () => {
        assert.equal(
            service.getFaviconUrl("https://example.nl/private?token=example#section"),
            "https://example.nl/favicon.ico",
        );
        assert.throws(() => service.getFaviconUrl("javascript:alert(1)"));
    });
});

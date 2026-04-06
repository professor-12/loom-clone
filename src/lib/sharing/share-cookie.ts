import "server-only";

import crypto from "crypto";

const COOKIE_VERSION = "v1";

function getSecret(): string {
    const s = process.env.SHARE_LINK_COOKIE_SECRET ?? process.env.JWT_SECRET;
    if (!s) {
        throw new Error(
            "Missing SHARE_LINK_COOKIE_SECRET (or JWT_SECRET) for share link cookies"
        );
    }
    return s;
}

function sign(payload: string): string {
    return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function makeShareAccessCookieValue(shareId: string): string {
    // Legacy/simple cookie (used for password-protected shares)
    return `${COOKIE_VERSION}.${shareId}.${sign(shareId)}`;
}

export function verifyShareAccessCookieValue(
    shareId: string,
    value: string | undefined
): boolean {
    if (!value) return false;
    const parts = value.split(".");
    const [v, id] = parts;
    if (v !== COOKIE_VERSION) return false;
    if (id !== shareId) return false;

    // v1.{shareId}.{sig}
    if (parts.length === 3) {
        const sig = parts[2];
        return sig === sign(shareId);
    }
    // v1.{shareId}.{emailHash}.{sig}
    if (parts.length === 4) {
        const emailHash = parts[2];
        const sig = parts[3];
        return sig === sign(`${shareId}.${emailHash}`);
    }
    return false;
}

export function shareAccessCookieName(shareId: string) {
    return `share_access_${shareId}`;
}

export function sha256Hex(input: string) {
    return crypto.createHash("sha256").update(input).digest("hex");
}

export function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

export function makeApprovedShareAccessCookieValue(
    shareId: string,
    email: string
) {
    const emailHash = sha256Hex(normalizeEmail(email));
    const sig = sign(`${shareId}.${emailHash}`);
    return `${COOKIE_VERSION}.${shareId}.${emailHash}.${sig}`;
}

export function readApprovedEmailHashFromCookie(
    shareId: string,
    value: string | undefined
): string | null {
    if (!value) return null;
    const parts = value.split(".");
    if (parts.length !== 4) return null;
    const [v, id, emailHash] = parts;
    if (v !== COOKIE_VERSION) return null;
    if (id !== shareId) return null;
    return emailHash || null;
}


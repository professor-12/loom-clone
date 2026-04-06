import "server-only";

import crypto from "crypto";
import type { BinaryLike } from "crypto";

const SCRYPT_KEYLEN = 64;
const SCRYPT_OPTS: crypto.ScryptOptions = { N: 16384, r: 8, p: 1 };

export type PasswordHash = `scrypt$${string}$${string}`;

function scrypt(
    password: BinaryLike,
    salt: BinaryLike,
    keylen: number,
    options: crypto.ScryptOptions
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, keylen, options, (err, derivedKey) => {
            if (err) reject(err);
            else resolve(derivedKey as Buffer);
        });
    });
}

export async function hashPassword(password: string): Promise<PasswordHash> {
    const salt = crypto.randomBytes(16).toString("hex");
    const derived = await scrypt(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTS);
    return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyPassword(
    password: string,
    encoded: string
): Promise<boolean> {
    const parts = encoded.split("$");
    if (parts.length !== 3) return false;
    const [algo, salt, hashHex] = parts;
    if (algo !== "scrypt") return false;

    const expected = Buffer.from(hashHex, "hex");
    const derived = await scrypt(
        password,
        salt,
        expected.length,
        SCRYPT_OPTS
    );
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
}


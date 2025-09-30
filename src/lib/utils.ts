import { PrismaClient } from "@/generated/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { JWTPayload } from "@/actions/auth.actions";
export const COOKIE_NAME = "jwt_token";
const JWT_EXPIRES_IN = "7d";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

declare global {
    var _prisma: PrismaClient;
}

const prisma = globalThis._prisma ?? new PrismaClient();

if (process.env.NODE_ENV == "development") {
    globalThis._prisma = new PrismaClient();
}

export function issueJwt(user: JWTPayload) {
    return jwt.sign(
        {
            sub: user.sub,
            email: user.email,
        } satisfies JwtPayload,
        process.env.JWT_SECRET as string,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

export { prisma };

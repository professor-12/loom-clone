import jwt, { JwtPayload } from "jsonwebtoken";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { JWTPayload } from "@/actions/auth.actions";
import { PrismaClient } from "@prisma/client";
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

export function issueJwt(user: JWTPayload & { avatar_url: string | null }) {
    return jwt.sign(
        {
            sub: user.sub,
            email: user.email,
            avatar_url: user.avatar_url,
        } satisfies JwtPayload & { avatar_url: string | null },
        process.env.JWT_SECRET as string,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

export { prisma };

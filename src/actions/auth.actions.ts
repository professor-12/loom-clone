"use server";

import {
    GithubService,
    GoogleServices,
    signInWithGithub,
    signInWithGoogle,
} from "@/services/auth.service";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { issueJwt, prisma } from "@/lib/utils";

export interface JWTPayload {
    sub: string; // user id
    email: string;
    roles?: string[];
    exp?: number;
    iat?: number;
}

export async function signInWithGoogleAction(code: string) {
    const google = new GoogleServices();
    const { access_token, id_token } = await google.getTokens(code);
    const { email, name, picture, verified_email, id } =
        await google.getUserInfo(id_token, access_token);

    const user = await signInWithGoogle({
        accessToken: access_token,
        refreshToken: id_token,
        email,
        name,
        emailVerified: verified_email,
        image: picture,
        provider: "google",
        providerUserId: id,
    });

    if (!user) {
        throw new Error("Failed to create User");
    }

    const token = issueJwt({
        email: user.email,
        sub: user.id,
        avatar_url: user.avatarUrl,
    });

    (await cookies()).set("jwt_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
    });
}
export async function signInWithGithubAction(code: string) {
    const github = new GithubService();
    const { access_token, token_type, scope } = await github.getTokens(code);
    const { email, name, avatar_url, verified_email, id } =
        await github.getUserInfo(access_token);

    const user = await signInWithGithub({
        accessToken: access_token,
        refreshToken: access_token,
        email,
        name,
        emailVerified: verified_email,
        image: avatar_url,
        provider: "google",
        providerUserId: id,
    });

    if (!user) {
        throw new Error("Failed to create User");
    }

    const token = issueJwt({
        email: user.email,
        sub: user.id,
        avatar_url: user.avatarUrl,
    });

    (await cookies()).set("jwt_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
    });
}

export const getUser = async () => {
    const token = (await cookies()).get("jwt_token")?.value;

    if (!token) {
        return { error: "Not authenticated", data: null, status: 401 };
    }

    let payload: JWTPayload;
    try {
        payload = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JWTPayload;
    } catch {
        return { error: "Invalid or expired token", data: null, status: 401 };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: payload.email },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                avatarUrl: true,
            },
        });

        if (!user) {
            return { error: "User not found", data: null, status: 404 };
        }

        return { error: null, data: user, status: 200 };
    } catch (err) {
        console.error("getUser error:", err);
        return { error: "Internal server error", data: null, status: 500 };
    }
};

export async function signOut() {
    (await cookies()).delete("jwt_token");
    redirect("/");
    // return { success: true };
}

export const auth = async () => {
    const token = (await cookies()).get("jwt_token")?.value;

    if (!token) {
        return { data: null, error: "Unauthorized", status: 401 };
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

        return {
            data: user,
            error: null,
            status: 200,
        };
    } catch {
        return {
            data: null,
            error: "Unauthorized",
            status: 401,
        };
    }
};

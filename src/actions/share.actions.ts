"use server";

import { prisma } from "@/lib/utils";
import { auth } from "@/actions/auth.actions";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { hashPassword, verifyPassword } from "@/lib/sharing/password";
import {
    makeShareAccessCookieValue,
    makeApprovedShareAccessCookieValue,
    normalizeEmail,
    readApprovedEmailHashFromCookie,
    shareAccessCookieName,
    sha256Hex,
    verifyShareAccessCookieValue,
} from "@/lib/sharing/share-cookie";

const SHARE_COOKIE_MAX_AGE_S = 7 * 24 * 60 * 60;

function isExpired(expiresAt: Date | null): boolean {
    if (!expiresAt) return false;
    return expiresAt.getTime() <= Date.now();
}

export type ShareVideoResult =
    | { status: "OK"; data: any }
    | { status: "LOCKED" }
    | { status: "REQUEST_ACCESS" }
    | { status: "REVOKED" }
    | { status: "EXPIRED" }
    | { status: "NOT_FOUND" }
    | { status: "UNAUTHORIZED" };

export async function getOrCreateShareLink(videoId: string) {
    const { data } = await auth();
    if (!data?.sub) return { error: "UNAUTHORIZED", data: null as any };

    const video = await prisma.video.findFirst({
        where: { id: videoId, userId: data.sub },
        select: { id: true },
    });
    if (!video) return { error: "NOT_FOUND", data: null as any };

    const existing = await prisma.shareLink.findFirst({
        where: {
            videoId,
            createdByUserId: data.sub,
            revokedAt: null,
        },
        select: {
            id: true,
            expiresAt: true,
            passwordHash: true,
            revokedAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
    if (existing) return { error: null, data: existing };

    const created = await prisma.shareLink.create({
        data: { videoId, createdByUserId: data.sub },
        select: {
            id: true,
            expiresAt: true,
            passwordHash: true,
            revokedAt: true,
        },
    });
    return { error: null, data: created };
}

export async function getShareLinkOwnerSnapshot(videoId: string) {
    const { data } = await auth();
    if (!data?.sub) return { error: "UNAUTHORIZED", data: null as any };

    const link = await prisma.shareLink.findFirst({
        where: { videoId, createdByUserId: data.sub, revokedAt: null },
        select: {
            id: true,
            expiresAt: true,
            passwordHash: true,
            revokedAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return { error: null, data: link };
}

export async function rotateShareLink(videoId: string) {
    const { data } = await auth();
    if (!data?.sub) return { error: "UNAUTHORIZED", data: null as any };

    const video = await prisma.video.findFirst({
        where: { id: videoId, userId: data.sub },
        select: { id: true },
    });
    if (!video) return { error: "NOT_FOUND", data: null as any };

    await prisma.shareLink.updateMany({
        where: { videoId, createdByUserId: data.sub, revokedAt: null },
        data: { revokedAt: new Date() },
    });

    const created = await prisma.shareLink.create({
        data: { videoId, createdByUserId: data.sub },
        select: { id: true, expiresAt: true, passwordHash: true, revokedAt: true },
    });

    revalidatePath("/library", "layout");
    return { error: null, data: created };
}

export async function updateShareLinkSettings(
    shareId: string,
    opts: { password?: string | null; expiresAt?: string | null }
) {
    const { data } = await auth();
    if (!data?.sub) return { error: "UNAUTHORIZED", data: null as any };

    const link = await prisma.shareLink.findFirst({
        where: { id: shareId, createdByUserId: data.sub, revokedAt: null },
        select: { id: true, videoId: true },
    });
    if (!link) return { error: "NOT_FOUND", data: null as any };

    const password = (opts.password ?? "").trim();
    const expiresAtStr = (opts.expiresAt ?? "").trim();
    const expiresAt = expiresAtStr ? new Date(expiresAtStr) : null;

    const passwordHash =
        password.length > 0 ? await hashPassword(password) : null;

    const updated = await prisma.shareLink.update({
        where: { id: shareId },
        data: {
            passwordHash,
            expiresAt,
        },
        select: {
            id: true,
            expiresAt: true,
            passwordHash: true,
            revokedAt: true,
        },
    });

    revalidatePath("/library", "layout");
    return { error: null, data: updated };
}

export async function unlockShareLink(shareId: string, password: string) {
    const link = await prisma.shareLink.findFirst({
        where: { id: shareId, revokedAt: null },
        select: { id: true, passwordHash: true, expiresAt: true, revokedAt: true },
    });
    if (!link) return { error: "NOT_FOUND" as const };
    if (link.revokedAt) return { error: "REVOKED" as const };
    if (isExpired(link.expiresAt ?? null)) return { error: "EXPIRED" as const };

    if (!link.passwordHash) {
        // nothing to unlock; still set cookie so page can proceed uniformly
        const value = makeShareAccessCookieValue(shareId);
        (await cookies()).set(shareAccessCookieName(shareId), value, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: Math.min(
                SHARE_COOKIE_MAX_AGE_S,
                link.expiresAt
                    ? Math.max(
                          60,
                          Math.floor(
                              (link.expiresAt.getTime() - Date.now()) / 1000
                          )
                      )
                    : SHARE_COOKIE_MAX_AGE_S
            ),
            path: "/",
        });
        return { error: null } as const;
    }

    const ok = await verifyPassword(password, link.passwordHash);
    if (!ok) return { error: "INVALID_PASSWORD" } as const;

    const value = makeShareAccessCookieValue(shareId);
    (await cookies()).set(shareAccessCookieName(shareId), value, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: Math.min(
            SHARE_COOKIE_MAX_AGE_S,
            link.expiresAt
                ? Math.max(
                      60,
                      Math.floor((link.expiresAt.getTime() - Date.now()) / 1000)
                  )
                : SHARE_COOKIE_MAX_AGE_S
        ),
        path: "/",
    });

    return { error: null } as const;
}

function isValidEmail(email: string) {
    const e = normalizeEmail(email);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export async function requestShareAccess(shareId: string, email: string) {
    const reqEmail = normalizeEmail(email);
    if (!isValidEmail(reqEmail)) {
        return { error: "INVALID_EMAIL" as const };
    }

    const link = await prisma.shareLink.findFirst({
        where: { id: shareId, revokedAt: null },
        select: { id: true, expiresAt: true, revokedAt: true },
    });
    if (!link) return { error: "NOT_FOUND" as const };
    if (link.revokedAt) return { error: "REVOKED" as const };
    if (isExpired(link.expiresAt ?? null)) return { error: "EXPIRED" as const };

    const row = await prisma.shareAccessRequest.upsert({
        where: {
            shareLinkId_requestEmail: {
                shareLinkId: shareId,
                requestEmail: reqEmail,
            },
        },
        create: {
            shareLinkId: shareId,
            requestEmail: reqEmail,
            status: "PENDING",
        },
        update: {
            status: "PENDING",
            decidedAt: null,
        },
        select: { id: true, status: true, requestedAt: true },
    });

    return { error: null, data: row } as const;
}

export async function confirmApprovedShareAccess(shareId: string, email: string) {
    const reqEmail = normalizeEmail(email);
    if (!isValidEmail(reqEmail)) {
        return { error: "INVALID_EMAIL" as const };
    }

    const row = await prisma.shareAccessRequest.findFirst({
        where: {
            shareLinkId: shareId,
            requestEmail: reqEmail,
            status: "APPROVED",
        },
        select: { id: true, shareLinkId: true },
    });
    if (!row) return { error: "NOT_APPROVED" as const };

    const link = await prisma.shareLink.findFirst({
        where: { id: shareId, revokedAt: null },
        select: { expiresAt: true },
    });
    if (!link) return { error: "NOT_FOUND" as const };

    const value = makeApprovedShareAccessCookieValue(shareId, reqEmail);
    (await cookies()).set(shareAccessCookieName(shareId), value, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: Math.min(
            SHARE_COOKIE_MAX_AGE_S,
            link.expiresAt
                ? Math.max(
                      60,
                      Math.floor((link.expiresAt.getTime() - Date.now()) / 1000)
                  )
                : SHARE_COOKIE_MAX_AGE_S
        ),
        path: "/",
    });

    return { error: null } as const;
}

export async function listShareAccessRequests(videoId: string) {
    const { data } = await auth();
    if (!data?.sub) return { error: "UNAUTHORIZED", data: null as any };

    const link = await prisma.shareLink.findFirst({
        where: { videoId, createdByUserId: data.sub, revokedAt: null },
        select: { id: true },
        orderBy: { createdAt: "desc" },
    });
    if (!link) return { error: null, data: [] as any[] };

    const reqs = await prisma.shareAccessRequest.findMany({
        where: { shareLinkId: link.id },
        orderBy: { requestedAt: "desc" },
        select: {
            id: true,
            requestEmail: true,
            status: true,
            requestedAt: true,
            decidedAt: true,
        },
    });

    return { error: null, data: reqs, shareId: link.id };
}

export async function approveShareAccessRequest(requestId: string) {
    const { data } = await auth();
    if (!data?.sub) return { error: "UNAUTHORIZED" as const };

    const req = await prisma.shareAccessRequest.findFirst({
        where: { id: requestId },
        select: { id: true, shareLinkId: true, requestEmail: true },
    });
    if (!req) return { error: "NOT_FOUND" as const };

    const link = await prisma.shareLink.findFirst({
        where: { id: req.shareLinkId, createdByUserId: data.sub },
        select: { id: true },
    });
    if (!link) return { error: "UNAUTHORIZED" as const };

    await prisma.shareAccessRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED", decidedAt: new Date() },
    });

    revalidatePath("/library", "layout");
    return { error: null } as const;
}

export async function denyShareAccessRequest(requestId: string) {
    const { data } = await auth();
    if (!data?.sub) return { error: "UNAUTHORIZED" as const };

    const req = await prisma.shareAccessRequest.findFirst({
        where: { id: requestId },
        select: { id: true, shareLinkId: true },
    });
    if (!req) return { error: "NOT_FOUND" as const };

    const link = await prisma.shareLink.findFirst({
        where: { id: req.shareLinkId, createdByUserId: data.sub },
        select: { id: true },
    });
    if (!link) return { error: "UNAUTHORIZED" as const };

    await prisma.shareAccessRequest.update({
        where: { id: requestId },
        data: { status: "DENIED", decidedAt: new Date() },
    });

    revalidatePath("/library", "layout");
    return { error: null } as const;
}

export async function getShareVideo(shareId: string): Promise<ShareVideoResult> {
    const link = await prisma.shareLink.findFirst({
        where: { id: shareId },
        include: {
            video: {
                include: { user: true },
            },
        },
    });


    if (!link) return { status: "NOT_FOUND" };
    if (link.revokedAt) return { status: "REVOKED" };
    if (isExpired(link.expiresAt)) return { status: "EXPIRED" };

    if (link.video.visibility === "PRIVATE") {
        const { data } = await auth();
        if (!data?.sub) return { status: "REQUEST_ACCESS" };
        const isOwner: boolean = link?.createdByUserId === data?.sub;
        if (isOwner) return { status: "OK", data: link?.video ?? null };
        const cookieStore = await cookies();
        const cookie = cookieStore.get(shareAccessCookieName(shareId))?.value;
        const emailHash = readApprovedEmailHashFromCookie(shareId, cookie);
        const sigOk = verifyShareAccessCookieValue(shareId, cookie);
        if (!emailHash || !sigOk) return { status: "REQUEST_ACCESS" };

        const approved = await prisma.shareAccessRequest.findMany({
            where: { shareLinkId: shareId, status: "APPROVED" },
            select: { requestEmail: true },
        });
        const match = approved.some((r: { requestEmail: string }) => {
            return sha256Hex(normalizeEmail(r.requestEmail)) === emailHash;
        });
        if (!match) return { status: "REQUEST_ACCESS" };
    }

    if (link.passwordHash) {
        const cookieStore = await cookies();
        const cookie = cookieStore.get(shareAccessCookieName(shareId))?.value;
        const ok = verifyShareAccessCookieValue(shareId, cookie);
        if (!ok) return { status: "LOCKED" };
    }

    return { status: "OK", data: link.video };
}

export async function getActiveShareLinkIdByVideoId(videoId: string) {
    const link = await prisma.shareLink.findFirst({
        where: { videoId, revokedAt: null },
        select: { id: true },
        orderBy: { createdAt: "desc" },
    });
    return { data: link?.id ?? null, error: null as string | null };
}


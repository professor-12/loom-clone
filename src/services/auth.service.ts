// import { AuthProvider } from "@/generated/prisma";
import { prisma } from "@/lib/utils";
import { User } from "better-auth";
import { AuthProvider } from "@prisma/client";

interface UserWithToken
    extends Omit<Omit<Omit<User, "id">, "createdAt">, "updatedAt">,
        Omit<AuthProvider, "userId"> {
    userId?: string;
}
export class GoogleServices {
    private client_id: string;
    private client_secret: string;
    private callback_url: string;

    constructor() {
        this.client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
        this.client_secret = process.env.GOOGLE_CLIENT_SECRET || "";
        this.callback_url = process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL || "";
    }

    getAuthUrl(state: string) {
        const rootUrl = "https://accounts.google.com/o/oauth2/auth";
        const options = {
            client_id: this.client_id,
            redirect_uri: this.callback_url,
            response_type: "code",
            scope: ["openid", "profile", "email"].join(" "),
            access_type: "offline",
            prompt: "const",
            state,
        };

        const queryString = new URLSearchParams(options)
            .toString()
            .replaceAll("+", "%20");
        return `${rootUrl}?${queryString}`;
    }

    async getTokens(code: string) {
        const url = "https://oauth2.googleapis.com/token";

        const values = {
            code,
            client_id: this.client_id,
            client_secret: this.client_secret,
            redirect_uri: this.callback_url,
            grant_type: "authorization_code",
        };

        const res = await fetch(url, {
            method: "POST",
            // headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(values),
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch tokens: ${res}`);
        }

        return res.json() as Promise<{
            access_token: string;
            id_token: string;
        }>;
    }

    async getUserInfo(id_token: string, access_token: string) {
        const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${id_token}` },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch user info: ${res.statusText}`);
        }

        return res.json();
    }
}
export class GithubService {
    private client_id: string;
    private client_secret: string;
    private callback_url: string;

    constructor() {
        this.client_id = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "";
        this.client_secret = process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET || "";
        this.callback_url = process.env.NEXT_PUBLIC_GITHUB_CALLBACK_URL || "";
    }

    getAuthUrl(state: string) {
        const rootUrl = "https://github.com/login/oauth/authorize";
        const options = {
            client_id: this.client_id,
            redirect_uri: this.callback_url,
            scope: ["read:user", "user:email"].join(" "),
            state,
            allow_signup: "true",
        };

        const queryString = new URLSearchParams(options).toString();
        return `${rootUrl}?${queryString}`;
    }

    async getTokens(code: string) {
        const url = "https://github.com/login/oauth/access_token";

        const values = {
            client_id: this.client_id,
            client_secret: this.client_secret,
            code,
            redirect_uri: this.callback_url,
        };

        const res = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(values),
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch tokens: ${res.statusText}`);
        }

        return res.json() as Promise<{
            access_token: string;
            token_type: string;
            scope: string;
        }>;
    }

    async getUserInfo(access_token: string) {
        const res = await fetch("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch user info: ${res.statusText}`);
        }

        const user = await res.json();

        console.log(user);
        // GitHub email may be private, so fetch separately if needed
        const emailRes = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        let email = null;
        if (emailRes.ok) {
            const emails = await emailRes.json();
            const primary = emails.find((e: any) => e.primary && e.verified);
            email = primary?.email || null;
        }

        console.log(user);
        return { ...user, email };
    }
}

export const signInWithGoogle = async (
    user: Omit<Omit<UserWithToken, "createdAt">, "id">
) => {
    const existinguser = await prisma.user.findUnique({
        where: { email: user.email },
        omit: { password: true },
    });

    if (existinguser) {
        return existinguser;
    }

    const newUser = await prisma.user.create({
        data: {
            email: user.email,
            avatarUrl: user.image,
            name: user.name,
            provider: {
                connectOrCreate: {
                    create: {
                        accessToken: user.accessToken,
                        provider: user.provider,
                        providerUserId: user.providerUserId,
                    },
                    where: {
                        provider_providerUserId: {
                            provider: user.provider,
                            providerUserId: user.providerUserId,
                        },
                    },
                },
            },
        },
        omit: { password: true },
    });

    return newUser;
};
export const signInWithGithub = async (
    user: Omit<Omit<UserWithToken, "createdAt">, "id">
) => {
    const existinguser = await prisma.user.findUnique({
        where: { email: user.email },
        omit: { password: true },
    });

    if (existinguser) {
        return existinguser;
    }

    const newUser = await prisma.user.create({
        data: {
            email: user.email,
            avatarUrl: user.image,
            name: user.name,
            provider: {
                connectOrCreate: {
                    create: {
                        accessToken: user.accessToken,
                        provider: user.provider,
                        providerUserId: user.providerUserId,
                    },
                    where: {
                        provider_providerUserId: {
                            provider: user.provider,
                            providerUserId: user.providerUserId,
                        },
                    },
                },
            },
        },
        omit: { password: true },
    });

    return newUser;
};

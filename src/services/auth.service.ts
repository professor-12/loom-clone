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

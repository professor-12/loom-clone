import { auth } from "./actions/auth.actions";

export async function middleware() {
    await auth();
}

export const config = {
    matcher: "/dashboard",
};

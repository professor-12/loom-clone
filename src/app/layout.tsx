import { PropsWithChildren } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import AuthServer from "@/context/AuthServer";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "Free screen recorder for Mac and PC | LooP",
};

// const poppins = Poppins({ weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: "--poppins" })

export default function RootLayout({ children }: PropsWithChildren) {
    const id = process.env.MEASUREMENT_ID || "G-XXXXXXX";
    return (
        <>
            <html lang="en">
                <body className={""} cz-shortcut-listen="true">
                    <AuthServer>
                        <Toaster />
                        {children}
                    </AuthServer>
                </body>
                <GoogleAnalytics gaId={id} />
            </html>
        </>
    );
}

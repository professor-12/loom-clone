import { PropsWithChildren } from "react"
import "./globals.css"
import { Metadata } from "next"
import { Poppins } from "next/font/google"
import AuthServer from "@/context/AuthServer"



export const metadata: Metadata = {
  title: "Free screen recorder for Mac and PC | LooP"
}

// const poppins = Poppins({ weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], variable: "--poppins" })


export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <html lang="en">
        <body className={""} cz-shortcut-listen="true">
          <AuthServer>
            {children}
          </AuthServer>
        </body>
      </html>
    </>
  )
}
import { PropsWithChildren } from "react"
import "./globals.css"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free screen recorder for Mac and PC | Loom"
}


export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body cz-shortcut-listen="true">
          {children}
        </body>
      </html>
    </>
  )
}
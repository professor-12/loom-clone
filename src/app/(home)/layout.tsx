import { PropsWithChildren } from "react"
import NavBar from "@/components/nav-bar"



export default function RootLayout({ children }: PropsWithChildren) {
      return (
            <main>
                  <NavBar />
                  {children}
            </main>
      )
}
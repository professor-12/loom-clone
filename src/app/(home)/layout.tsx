import { PropsWithChildren } from "react"
import NavBar from "@/components/nav-bar"
import Footer from "@/components/footer"



export default function RootLayout({ children }: PropsWithChildren) {
      return (
            <main>
                  <NavBar />
                  {children}
                  <Footer />
            </main>
      )
}
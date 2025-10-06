"use client"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
`
Download
The Replay | Loom’s Blog
Help Center
Webinars
Customer Stories
Community
`
const navData = {
      Products: ["Screen Recorder", "Screenshot", "Loop Ai", "Security", "loopSDK"],
      Solutions: ["Sales", "Engineering", "Design", "Marketing", "Product Management", "Support", "Presentation"],
      Resources: ["Download", "The Play | Loop's Blog", "Help Center", "Webinars", "Customer Stories", "Community"],
}

const NavItems = () => {
      const [xPos, setXPos] = useState<number | null>(null)
      const [hovering, setHovering] = useState(false)
      const [selectedItem, setSelectedItem] = useState<string | null>(null)

      useEffect(() => {
            if (!hovering) {
                  const timeout = setTimeout(() => {
                        setXPos(null)
                        setSelectedItem(null)
                  }, 150)
                  return () => clearTimeout(timeout)
            }
      }, [hovering])

      const handleHover = (e: React.MouseEvent<HTMLLIElement>, label: string) => {
            const rect = e.currentTarget.getBoundingClientRect()
            setXPos(rect.left)
            setSelectedItem(label)
      }

      return (
            <ul className="relative flex-center">
                  {Object.keys(navData).map((label) => (
                        <NavItem
                              key={label}
                              label={label}
                              onHover={handleHover}
                              setHovering={setHovering}
                        />
                  ))}
                  <p className="flex-center  z-[99999999999]   mr-8 gap-1.5 cursor-pointer">Enterprises</p>
                  <p className="flex-center  z-[99999999999]  gap-1.5 cursor-pointer">Pricing</p>

                  <Link href="/login" prefetch="unstable_forceStale">
                        <li className="flex-center gap-1.5 cursor-pointer ml-8">Sign In</li>
                  </Link>

                  <AnimatePresence>
                        {xPos && selectedItem && (
                              <DropDown
                                    key="dropdown"
                                    x={xPos}
                                    setHovering={setHovering}
                                    items={(navData as any)[selectedItem as any] as any}
                              />
                        )}
                  </AnimatePresence>
            </ul>
      )
}

export default NavItems



const NavItem = ({
      label,
      onHover,
      setHovering,
}: {
      label: string
      onHover?: (e: React.MouseEvent<HTMLLIElement>, label: string) => void
      setHovering?: React.Dispatch<React.SetStateAction<boolean>>
}) => (
      <li
            className="flex-center  z-[99999999999]   mr-8 gap-1.5 cursor-pointer"
            onMouseEnter={(e) => {
                  onHover?.(e, label)
                  setHovering?.(true)
            }}
            onMouseLeave={() => setHovering?.(false)}
      >
            {label}
      </li>
)



const DropDown = ({
      x,
      setHovering,
      items,
}: {
      x: number
      setHovering: React.Dispatch<React.SetStateAction<boolean>>
      items: string[]
}) => (
      <motion.div
            animate={{ opacity: 1, y: 0, left: x }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, type: "spring", stiffness: 150, damping: 20 }}
            style={{
                  position: "fixed",
                  top: "5rem",
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className="bg-white shadow-[0px_0px_.5rem] shadow-slate-600/50 text-lg w-[18rem]  rounded-4xl p-6 space-y-3"
      >
            {items.map((item, idx) => (
                  <p
                        key={idx}
                        className="hover:text-blue-600 cursor-pointer transition-colors"
                  >
                        {item}
                  </p>
            ))}
      </motion.div>
)

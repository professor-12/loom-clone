"use client"
import { AnimatePresence, motion } from "motion/react"
import { useSideBar } from '@/store/side-bar-tore'
import { Bell, CircleUser, Infinity, PanelLeftClose, PanelRightOpen, SquareLibrary } from 'lucide-react'
import React from 'react'
import {
      Video,
      PlusCircle,
      Users,
      Trash2,
      Settings,
} from "lucide-react";
import Link from "next/link"
import { usePathname } from "next/navigation"

export const navItems = [
      {
            icon: CircleUser,
            name: "For you",
            link: "/dashboard",
      },
      {
            icon: SquareLibrary,
            name: "Library",
            link: "/library",
      },
      {
            icon: Bell,
            name: "Notifications",
            link: "/notifications",
      },
      {
            icon: Users,
            name: "Shared with Me",
            link: "/shared",
      },
      {
            icon: Trash2,
            name: "Trash",
            link: "/trash",
      },
      {
            icon: Settings,
            name: "Settings",
            link: "/settings",
      },
];

const SideBar = () => {
      const { isCollapsed, close, open } = useSideBar()
      return (
            <div className={`h-full max-sm:hidden duration-500 bg-[#F8F8F8] ${isCollapsed ? "w-[5rem]" : "w-[15rem]"}`}>
                  <div className={`w-full transition-all  items-center p-4 flex`}>
                        <AnimatePresence>
                              {
                                    !isCollapsed &&
                                    <motion.a href="/" initial={{ width: "0px" }} animate={{ width: "auto" }} exit={{ width: "0px" }} transition={{ duration: 0.4 }} className="text-xl  text-left  flex-1 font-bold flex items-center gap-1">

                                          <div className="p-1.5 rounded-md bg-primary"><Infinity className="text-white" /></div>
                                          <p>loop</p>
                                    </motion.a>
                              }
                        </AnimatePresence>
                        <div onClick={isCollapsed ? open : close} className='ring-primary mx-auto  p-1 cursor-pointer transition-all  active:ring-2 rounded-lg ring'>
                              {
                                    !isCollapsed ?
                                          <PanelRightOpen /> :
                                          <PanelLeftClose />
                              }
                        </div>

                  </div>

                  {/* Nav items */}
                  <div className="space-y-1  p-4  text-sm">
                        {navItems.map((item) => (
                              <NavItems key={item.link} isCollapsed={isCollapsed} item={item} />
                        ))}
                  </div>
            </div>
      )
}

export default SideBar


const NavItems = ({ isCollapsed, item }: { isCollapsed: boolean, item: any }) => {
      const path = usePathname()

      const isActive = item.link == path
      return (
            <Link
                  key={item.link}
                  href={item.link}
                  className={"flex hover:bg-[#E2E1F8]/60 transition-all duration-200 px-3 p-2 items-center gap-3 w-full mx-auto rounded-lg" + ` ${isActive && "bg-[#E2E1F8]/60"}`}
            >
                  <item.icon className={`font-bold ${isActive && 'text-primary'}`} />
                  {
                        !isCollapsed &&
                        <span className={`font-bold ${isActive && 'text-primary'}`}>{item.name}</span>
                  }
            </Link>
      )

}
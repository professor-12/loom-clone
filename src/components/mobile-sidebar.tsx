"use client";
import React, { useState } from "react";
import { LuMenu } from "react-icons/lu";
import SideBar from "./side-bar";
import { AnimatePresence, motion } from "motion/react";

const MobileSideBar = ({ className }: { className?: string }) => {
      const [isOpen, setIsOpen] = useState(false);

      return (
            <div className={`md:hidden ${className}`}>
                  <LuMenu
                        onClick={() => setIsOpen(true)}
                        className="w-8 h-8 cursor-pointer"
                  />

                  <AnimatePresence>
                        {isOpen && (
                              <>
                                    <BackDrop onClick={() => setIsOpen(false)} />
                                    <motion.div
                                          initial={{ x: "-100%" }}
                                          animate={{ x: 0 }}
                                          exit={{ x: "-100%" }}
                                          transition={{ duration: 0.2 }}
                                          className="fixed z-[999999] top-0 bottom-0 left-0"
                                    >
                                          <SideBar isMobile />
                                    </motion.div>
                              </>
                        )}
                  </AnimatePresence>
            </div>
      );
};

export default MobileSideBar;

// ✅ Fixed BackDrop
export const BackDrop = (props: any) => {
      return <motion.div {...props} exit={{ opacity: 0 }} className="fixed z-[9999] inset-0 bg-black/50" />;
};

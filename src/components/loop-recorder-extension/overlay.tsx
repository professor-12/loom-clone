"use client";
import React from "react";
import { createPortal } from "react-dom";

const Overlay = () => {
      if (typeof window === "undefined") return null;

      return createPortal(
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[9999]" />,
            document.body
      );
};

export default Overlay;

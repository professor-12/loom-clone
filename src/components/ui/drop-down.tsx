"use client"
import React, {
      createContext,
      useContext,
      useEffect,
      useId,
      useState,
} from "react"
import { createPortal } from "react-dom"

type DropDownContextType = {
      isOpen: boolean
      setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
      id: string
      dataId: string
      triggerRect: DOMRect | null
      setTriggerRect: React.Dispatch<React.SetStateAction<DOMRect | null>>
}

const DropDownContext = createContext<DropDownContextType | null>(null)

const DropDown = ({ children }: { children: React.ReactNode }) => {
      const [isOpen, setIsOpen] = useState(false)
      const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)
      const id = useId()
      const dataId = useId()

      useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                  const target = e.target as HTMLElement
                  if (
                        !target.closest(`[data-id="${dataId}"]`) &&
                        !target.closest(`#${id}`)
                  ) {
                        setIsOpen(false)
                  }
            }

            document.addEventListener("click", handleClickOutside)
            return () => document.removeEventListener("click", handleClickOutside)
      }, [dataId, id])

      return (
            <DropDownContext.Provider
                  value={{ isOpen, setIsOpen, id, dataId, triggerRect, setTriggerRect }}
            >
                  {children}
            </DropDownContext.Provider>
      )
}

const useDropDown = () => {
      const ctx = useContext(DropDownContext)
      if (!ctx) {
            throw new Error("DropDown components must be used inside <DropDown>")
      }
      return ctx
}

DropDown.Trigger = ({
      children,
      className = "",
}: {
      children: React.ReactNode
      className?: string
}) => {
      const { setIsOpen, id, setTriggerRect } = useDropDown()

      const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
            setTriggerRect(rect)
            setIsOpen((prev) => !prev)
      }

      return (
            <div id={id} onClick={handleClick} className={`inline-block ${className}`}>
                  {children}
            </div>
      )
}

DropDown.Body = ({
      children,
      className = "",
      align = "left",
}: {
      children: React.ReactNode
      className?: string
      align?: "left" | "right" | "center"
}) => {
      const { isOpen, dataId, triggerRect } = useDropDown()
      if (!isOpen || !triggerRect) return null

      const style: React.CSSProperties = {
            position: "absolute",
            top: triggerRect.bottom + window.scrollY + 8, // small margin
            left:
                  align === "left"
                        ? triggerRect.left + window.scrollX
                        : undefined,
            right:
                  align === "right"
                        ? window.innerWidth - triggerRect.right - window.scrollX
                        : align == "center" ? window.innerWidth - triggerRect.right : undefined,
            zIndex: 9999,
      }

      return createPortal(
            <div
                  data-id={dataId}
                  style={style}
                  className={`rounded-lg border bg-white shadow-lg  p-2 min-w-[150px] ${className}`}
            >
                  {children}
            </div>,
            document.body
      )
}


export default DropDown
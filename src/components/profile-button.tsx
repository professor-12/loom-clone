"use client"
import { JWTPayload, signOut } from '@/actions/auth.actions'
import { LogOut, X } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const ProfileButton = ({ data }: { data: JWTPayload & { avatar_url?: string } | null }) => {
      const { email, avatar_url } = data || {}
      const [isDropDown, setIsDropDown] = useState(false)

      useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                  const target = e.target as HTMLElement
                  if (!target.closest('[data-id="profile__"]') && !target.closest('#profile-trigger')) {
                        setIsDropDown(false)
                  }
            }

            document.addEventListener("click", handleClickOutside)
            return () => document.removeEventListener("click", handleClickOutside)
      }, [])

      return (
            <div className="relative">
                  <div
                        id="profile-trigger"
                        onClick={(e) => {
                              e.stopPropagation()
                              setIsDropDown((prev) => !prev)
                        }}
                        className="h-[35px] aspect-square overflow-hidden relative cursor-pointer text-xl capitalize text-white rounded-full bg-red-800 flex items-center justify-center"
                  >
                        {avatar_url ? (
                              <Image className="object-cover" src={avatar_url} fill alt="Profile" />
                        ) : (
                              <p className="text-xl font-bold">{email?.substring(0, 1)}</p>
                        )}
                  </div>
                  {isDropDown && (
                        <div
                              data-id="profile__"
                              className="absolute top-[160%] right-0 w-[280px] z-20 rounded-3xl bg-white border border-border shadow p-4"
                        >
                              <div className="flex w-full justify-end">
                                    <button
                                          onClick={() => setIsDropDown(false)}
                                          className="ring-2 cursor-pointer  h-8 w-8 flex items-center justify-center ring-primary/80 ring-offset-2 rounded-lg"
                                    >
                                          <X className="h-5 w-5 font-bold" />
                                    </button>
                              </div>

                              <div className="flex flex-col items-center">
                                    <Image
                                          src={avatar_url || "/default-avatar.png"}
                                          width={48}
                                          height={48}
                                          className="w-12 h-12 rounded-full"
                                          alt="Profile image"
                                    />
                                    <h1 className="font-semibold mt-2 truncate line-clamp-1">{email || "Anonymous"}</h1>
                                    <HR className="my-3" />

                                    <button
                                          onClick={async () => await signOut()}
                                          className="gap-2 text-black/80 cursor-pointer hover:text-red-400 text-sm flex items-center font-medium"
                                    >
                                          <LogOut className="h-4" /> Sign out
                                    </button>
                              </div>
                        </div>
                  )}
            </div>
      )
}

export default ProfileButton

const HR = (props: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props} className={`w-full h-px bg-border ${props.className || ""}`} />
)

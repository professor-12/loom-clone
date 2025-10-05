"use client"
import { JWTPayload, signOut } from '@/actions/auth.actions'
import { LogOut, X } from 'lucide-react'
import Image from 'next/image'
import DropDown from './ui/drop-down'

const ProfileButton = ({ data }: { data: JWTPayload & { avatar_url?: string } | null }) => {
      const { email, avatar_url } = data || {}
      return (
            // <div className="relative">
            <DropDown>
                  {/* <DropDown.Wrapper> */}
                  <DropDown.Trigger className="h-[35px] aspect-square overflow-hidden relative cursor-pointer text-xl capitalize text-white rounded-full bg-red-800 flex items-center justify-center">
                        {avatar_url ? (
                              <Image className="object-cover" src={avatar_url} fill alt="Profile" />
                        ) : (
                              <p className="text-xl font-bold">{email?.substring(0, 1)}</p>
                        )}
                  </DropDown.Trigger>
                  <DropDown.Body align='right' className="top-[160%] absolute body right-0 w-[280px] !rounded-3xl bg-white border border-border shadow p-4">
                        <div className=''>
                              <div className="flex  w-full justify-end">
                                    <button
                                          className="ring-2 cursor-pointer  h-8 w-8 flex items-center justify-center ring-primary/80 ring-offset-2 rounded-lg"
                                    >
                                          <DropDown.Trigger>
                                                <X className="h-5 w-5 font-bold" />
                                          </DropDown.Trigger>
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
                  </DropDown.Body>
                  {/* </DropDown.Wrapper> */}
            </DropDown >

            // </div>
      )
}

export default ProfileButton

const HR = (props: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props} className={`w-full h-px bg-border ${props.className || ""}`} />
)

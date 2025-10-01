"use client"
import React, { useState } from 'react'

const tabItem = ["Videos", "Screenshot", "Archive"]

const Tab = () => {
      const [a, b] = useState(0)
      return (
            <div className='flex items-center gap-6 h-10 font-bold text-muted-foreground '>
                  {tabItem.map((item, indx) => {
                        return <div onClick={() => { b(indx) }} className={`after:bg-primary cursor-pointer hover:text-black  selection:bg-none select-none after:w-full h-full justify-between  after:h-1  after:rounded-2xl flex flex-col ${indx == a ? "text-black" : "after:hidden"}`} key={item}>{item}</div>
                  })}
            </div>
      )
}

export default Tab
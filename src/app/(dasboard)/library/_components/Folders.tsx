import React from 'react'
import { FaRegFolderClosed } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";

const Folders = () => {
      return (
            <div className=''>
                  <h1 className='font-bold text-lg'>Folders</h1>
                  <FolderContainer />
            </div>
      )
}

export default Folders


const FolderContainer = () => {
      return (
            <div className='w-full pt-5 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 lg:grid-cols-4 '>
                  {
                        [...(Array(3).fill(null).map((e, index) => {
                              return <FolderCard key={index} />
                        }))]
                  }

            </div>
      )

}


const FolderCard = () => {
      return (<div className='border p-4 px-6 border-border rounded-2xl ring-transparent ring-2 cursor-pointer flex-center hover:ring-indigo-500'>
            <div className='flex justify-between  flex-1 items-center'>
                  <div className='flex items-center gap-2'>
                        <FaRegFolderClosed />
                        <div className=''>
                              <h1 className='font-bold'>Untitled Folder</h1>
                              <p>0 vidoes</p>
                        </div>
                  </div>

                  <div>
                        <BsThreeDots />
                  </div>
            </div>
      </div>)
}
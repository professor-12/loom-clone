// "use client"
import { auth } from '@/actions/auth.actions'
import { getVideos } from '@/actions/video.actions'
import { Button } from '@/components/ui/button'
import { User, Visibility } from '@prisma/client'
import { Video as _Video } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { BiCommentDetail } from 'react-icons/bi'
import { FaRegSmile } from 'react-icons/fa'
import { LuEye } from 'react-icons/lu'

const Video = async () => {
      return (
            <div>
                  <div className='flex justify-between'>
                        <h1 className='font-bold text-lg'>Videos</h1>
                        <div className='flex items-center gap-3'>
                              <Button variant={"outline"} className='rounded-lg font-semibold text-black/99 text-xs'>Upload Date</Button>
                              <Button variant={"outline"} className='rounded-lg font-semibold text-black/90 text-xs'>Newest to Oldest</Button>
                        </div>
                  </div>
                  <VideoContainer>

                  </VideoContainer>
            </div>
      )
}

export default Video




export const VideoContainer = async () => {
      const { data } = await getVideos()
      console.log(data)
      return (
            <div className='grid py-12 gap-3 xl:grid-cols-4  sm:grid-cols-2 lg:grid-cols-3 grid-cols-1'>
                  {
                        data?.map((video) => (

                              <VideoCard {...video} key={video.id} />
                        ))
                  }
            </div>
      )
}

export const VideoCard = async (props: _Video & { user: User }) => {
      const { description, title, thumbnailUrl, id, url, userId, duration, visibility, user: { name, avatarUrl } } = props
      // const { data } = await auth()
      return (<Link href={`/share/${id}`} className='overflow-hidden group cursor-pointer rounded-3xl transition-all duration-200 hover:ring-primary ring-transparent ring-2   border-border border'>
            <div className='h-[14rem] group-hover:brightness-50 brightness-90  bg-black/30'>
                  <Image className='w-full h-full object-center object-cover' width={500} height={500} src={thumbnailUrl! as string} alt='Poster' loading="lazy" /></div>
            <div className='flex-1 p-3 pb-6 flex flex-col'>
                  <div className='flex items-center gap-2'>
                        <div className='size-8 flex-center font-bold bg-[#8D6E63] overflow-hidden rounded-full'>
                              <Image src={avatarUrl as string} width={200} height={200} alt='20029' className='object-center object-cover' />
                        </div>
                        <div>
                              <h1 className='font-bold text-[15px]'>{name}</h1>
                              <p className='text-xs font-bold text-muted-foreground'>{visibility}</p>
                        </div>
                  </div>
                  <div className='font-bold my-3'>{description ?? "No description"}</div>
                  <div className='flex  mt-auto text-muted-foreground font-light items-center gap-4'>
                        <p className='flex items-center gap-1'>
                              <LuEye />
                              <span className='text-sm'>0</span>
                        </p>
                        <p className='flex items-center gap-1'>
                              <BiCommentDetail />
                              <span className='text-sm'>4</span>
                        </p>
                        <p className='flex items-center gap-1'>
                              <FaRegSmile />
                              <span className='text-sm'>2</span>
                        </p>
                  </div>
            </div>
      </Link>)
}
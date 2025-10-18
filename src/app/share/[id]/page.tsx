import { getVideo } from '@/actions/video.actions'
import React from 'react'
import HeaderDetail from '../header'
import VideoPlayer from '../components/VideoPlayer'


type Props = {
      params: Promise<{ id: string }>;
      searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};


export async function generateMetadata({ params }: Props) {
      const { id } = await params
      const { data } = await getVideo(id) as any
      return {
            title: data.title,
            description: data.description,
            image: data.thumbnail
      }
}
const Share = async ({ params }: { params: Promise<{ id: string }> }) => {
      const { id } = await params
      const { data } = await getVideo(id)

      return (
            <div>
                  <HeaderDetail data={data as any} />
                  <main className='p-6 flex'>
                        <div className='flex-[2.5] px-24'>
                              <VideoPlayer src={data!.url} />
                        </div>
                        <div className='flex-1'>
                              <div>Transcript</div>
                        </div>
                  </main>
            </div>
      )
}

export default Share
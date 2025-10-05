import { getVideo } from '@/actions/video.actions'
import React from 'react'

const Share = async ({ params }: { params: Promise<{ id: string }> }) => {
      const { id } = await params
      const { data } = await getVideo(id)
      console.log(data)
      return (
            <div>{id}</div>
      )
}

export default Share
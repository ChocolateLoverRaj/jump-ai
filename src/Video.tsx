import { observer } from 'mobx-react-lite'
import { useContext, useLayoutEffect, useState, useRef } from 'react'
import VideoContext from './VideoContext'
import never from 'never'
import { ObservablePromise } from 'mobx-observable-promise'

const Video = observer(() => {
  const { result } = useContext(VideoContext)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [playPromise] = useState(() => new ObservablePromise(async () => {
    const video = videoRef.current ?? never()

    await video.play()

    video.width = video.videoWidth
    video.height = video.videoHeight
  }).execute())

  useLayoutEffect(() => {
    const video = videoRef.current ?? never()
    video.srcObject = result
    return () => {
      video.srcObject = null
      result.getTracks().forEach(track => track.stop())
    }
  }, [result])

  return (
    <>
      FPS: {result.getVideoTracks()[0].getSettings().frameRate} <br />
      <video ref={videoRef} />
      {playPromise.isExecuting && 'Playing video'}
      {playPromise.isError && 'Error playing video'}
    </>
  )
})

export default Video

import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useRef, useState } from 'react'
import VideoContext from './VideoContext'
import never from 'never'
import { PoseDetector } from '@tensorflow-models/pose-detection'
import repeatedAnimationFrame from './repeatedAnimationFrame'
import { ObservablePromise } from 'mobx-observable-promise'
import getLowestPointY from './getLowestPointY'

export interface CanvasProps {
  detector: PoseDetector
}

const jumpBarWidth = 70

const Canvas = observer<CanvasProps>(({ detector }) => {
  const { result } = useContext(VideoContext)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [playPromise] = useState(() => new ObservablePromise(async () => {
    const video = videoRef.current ?? never()
    const canvas = canvasRef.current ?? never()

    video.srcObject = result
    await video.play()

    video.width = video.videoWidth
    video.height = video.videoHeight

    canvas.width = video.videoWidth + jumpBarWidth
    canvas.height = video.videoHeight
  }))

  useEffect(() => {
    if (!(playPromise.wasExecuted || playPromise.isExecuting)) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      playPromise.execute().catch()
    }
    if (!playPromise.wasSuccessful) return
    const video = videoRef.current ?? never()
    const canvas = canvasRef.current ?? never()

    const ctx = canvas.getContext('2d') ?? never()

    interface RecordedY {
      time: number
      value: number
    }
    let recordedYs: RecordedY[] = []
    const recordLastMs = 200
    let lastSpeed = 0
    let isInAir = false
    /**
     * This change in position is too small to count as a jump
     */
    const deadZoneJump = 5
    /**
     * If the speed is within this then it's not moving
     */
    const deadZoneSpeed = 0.1
    /**
     * A jump always ends within this of where it started
     */
    const maxLandingDiff = 30

    return repeatedAnimationFrame(async () => {
      // Draw the image
      // Because the image from camera is mirrored, need to flip horizontally.
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(video, jumpBarWidth, 0)
      ctx.resetTransform()

      // Calculate poses
      const poses = await detector.estimatePoses(video, { flipHorizontal: true })
      if (poses[0] !== undefined) {
        const yNow = getLowestPointY(poses[0].keypoints)
        const timeNow = Date.now()

        const previousYs = recordedYs.map(({ value }) => value)
        const greatestY = Math.max(...previousYs)
        const leastY = Math.min(...previousYs)
        const yOffset = previousYs.length > 0
          ? yNow < leastY
            ? (yNow - greatestY)
            : 0
          : 0
        const ySpeed = yOffset !== 0
          ? yOffset / (timeNow - (recordedYs.reverse().find(({ value }) => value === (yOffset > 0 ? leastY : greatestY)) ?? never()).time)
          : 0

        // Draw current height
        ctx.fillStyle = 'green'
        ctx.fillRect(canvas.width - jumpBarWidth, 0, jumpBarWidth, canvas.height)
        if (isInAir) {
          ctx.fillStyle = 'red'
          ctx.fillRect(canvas.width - jumpBarWidth, yNow, jumpBarWidth, previousYs[0] - yNow)
        }

        // REMEMBER: +speed means moving 'down', and -speed means moving 'up'
        if (!isInAir && Math.abs(lastSpeed) < deadZoneSpeed && yOffset < -deadZoneJump) {
          console.log('Feet left ground', ySpeed)
          isInAir = true
          recordedYs = [recordedYs.reverse().find(({ value }) => value === greatestY) as RecordedY]
        } else if (
          isInAir &&
          // Has stopped moving
          Math.abs(ySpeed) < deadZoneSpeed &&
          // Is close to where jumped from
          // This prevents it from touching the ground if they are actually at the highest point in their jump in the dead zone speed
          Math.abs(yNow - previousYs[0]) <= maxLandingDiff
        ) {
          console.log('Feet touched ground', ySpeed)
          isInAir = false
          // Reset
          recordedYs = []
        }

        // Reset stuff
        lastSpeed = ySpeed
        if (!isInAir) {
        // Remove recorded ys from before {magic ms} ago
          while (recordedYs[0]?.time < timeNow - recordLastMs) {
            recordedYs.shift()
          }
          recordedYs.push({
            time: timeNow,
            value: yNow
          })
        }
      }
    })
  }, [playPromise.wasSuccessful])

  return (
    <>
      <video ref={videoRef} hidden />
      <canvas ref={canvasRef} />
      {playPromise.isExecuting && 'Playing video'}
      {playPromise.isError && 'Error playing video'}
    </>
  )
})

export default Canvas

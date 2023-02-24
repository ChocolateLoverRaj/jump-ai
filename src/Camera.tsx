import { FC } from 'react'
import CanCamera from './CanCamera'

const Camera: FC = () => {
  return (
    <section>
      <h2>Select Camera and Preview</h2>
      {navigator?.mediaDevices?.getUserMedia !== undefined
        ? <CanCamera />
        : 'Your browser cannot give this page camera access'}
    </section>
  )
}

export default Camera

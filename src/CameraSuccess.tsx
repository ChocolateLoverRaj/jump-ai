import { FC } from 'react'
import Video from './Video'
import ChooseCamera from './ChooseCamera'

const CameraSuccess: FC = () => {
  return (
    <>
      <ChooseCamera />
      <br />
      <Video />
    </>
  )
}

export default CameraSuccess

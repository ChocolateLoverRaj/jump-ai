import { FC } from 'react'
import { Title, HeadProvider } from 'react-head'
import Camera from './Camera'
import Usb from './Usb'

const App: FC = () => {
  return (
    <>
      <HeadProvider>
        <Title>USB Camera</Title>
        <Camera />
        <Usb />
      </HeadProvider>
    </>
  )
}

export default App

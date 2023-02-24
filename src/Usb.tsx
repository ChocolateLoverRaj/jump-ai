import { FC } from 'react'
import CanUsb from './CanUsb'

const Usb: FC = () => {
  return (
    <section>
      <h2>Send video through USB</h2>
      {navigator.usb !== undefined
        ? <CanUsb />
        : "Your browser doesn't support Web USB"}
    </section>
  )
}

export default Usb

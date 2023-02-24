import { createAtom } from 'mobx'
import devices from './devices'
import internalGetDevices from './internalGetDevices'

const mobxUsbDevicesAtom = createAtom('USB Devices', () => {
  if (devices.get() === undefined) {
    internalGetDevices()
  }
})

export default mobxUsbDevicesAtom

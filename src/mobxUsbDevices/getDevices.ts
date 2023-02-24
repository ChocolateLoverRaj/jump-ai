import atom from './atom'
import devices from './devices'

/**
 * Like `navigator.usb.getDevices()`, but observable
 */
const getDevices = (): USBDevice[] => {
  atom.reportObserved()
  return devices.get() ?? []
}

export default getDevices

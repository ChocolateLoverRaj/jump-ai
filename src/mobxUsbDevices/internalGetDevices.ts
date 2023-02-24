import devices from './devices'

const internalGetDevices = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  navigator.usb.getDevices().then(usbDevices => {
    devices.set(usbDevices)
  })
}

export default internalGetDevices

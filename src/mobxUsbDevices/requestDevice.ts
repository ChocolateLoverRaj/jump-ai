const requestDevice = async (options?: USBDeviceRequestOptions): Promise<USBDevice> => {
  const device = await navigator.usb.requestDevice(options)
}

export default requestDevice

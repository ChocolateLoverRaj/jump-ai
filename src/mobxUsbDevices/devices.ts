import { observable } from 'mobx'

const devices = observable.box<USBDevice[] | undefined>(undefined)

export default devices

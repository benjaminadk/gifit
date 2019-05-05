import { remote } from 'electron'
import path from 'path'

const DATA_DIRECTORY = remote.app.getPath('userData')

export const APP_DIRECTORY = path.join(DATA_DIRECTORY, 'Gifit')
export const RECORDINGS_DIRECTORY = path.join(APP_DIRECTORY, 'Recordings')
export const OPTIONS_PATH = path.join(APP_DIRECTORY, 'options.json')
export const RECORDING_ICON = path.join(__static, 'recording.ico')

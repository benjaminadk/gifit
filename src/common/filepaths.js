import { remote } from 'electron'
import path from 'path'

const DATA_DIRECTORY = remote.app.getPath('userData')

export const OPTIONS_PATH = path.join(DATA_DIRECTORY, 'options.json')
export const TEMP_DIRECTORY = path.join(DATA_DIRECTORY, 'temp')

export const RECORDING_ICON = path.join(__static, 'recording.ico')

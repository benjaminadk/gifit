import { remote } from 'electron'
import path from 'path'

// directory to store app related data
export const TEMP_DIRECTORY = path.join(remote.app.getPath('temp'), 'Gifit')
// directory to store recordings
export const RECORDINGS_DIRECTORY = path.join(TEMP_DIRECTORY, 'Recordings')
// store options file
export const OPTIONS_PATH = path.join(remote.app.getPath('userData'), 'options.json')
// static assets
export const RECORDING_ICON = path.join(__static, 'video-recording.ico')
export const PAUSED_ICON = path.join(__static, 'video-paused.ico')

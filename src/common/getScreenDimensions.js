import { screen, remote } from 'electron'

export default function(index = 0) {
  const displays = screen.getAllDisplays()
  return displays[index].bounds
}

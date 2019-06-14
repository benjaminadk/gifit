import React from 'react'
import formatBytes from '../../lib/formatBytes'
import Svg from '../Svg'
import { Section, Download, PathInput } from './styles'

export default function Extras({
  ffmpegPath,
  ffmpegPathSize,
  onFFmpegChange,
  onFFmpegBlur,
  onFFmpegFolderClick,
  onFFmpegDownloadClick
}) {
  return (
    <div>
      <Section height={100}>
        <div className='title'>
          <div className='text'>Available external tools</div>
          <div className='divider' />
        </div>
        <div className='content'>
          <Download onClick={onFFmpegDownloadClick}>
            <Svg name={ffmpegPath ? 'check-green' : 'insert'} />
            <div className='right'>
              <div className='name'>FFmpeg</div>
              <div className='status'>
                <div>{ffmpegPath ? 'Downloaded' : 'Click here to download'}</div>
                <div>{ffmpegPath ? `${formatBytes(ffmpegPathSize)}` : ''}</div>
              </div>
            </div>
          </Download>
        </div>
      </Section>
      <Section height={200}>
        <div className='title'>
          <div className='text'>FFmpeg location</div>
          <div className='divider' />
        </div>
        <div className='content'>
          <PathInput>
            <input type='text' value={ffmpegPath} onChange={onFFmpegChange} onBlur={onFFmpegBlur} />
            <Svg name='folder' onClick={onFFmpegFolderClick} />
          </PathInput>
        </div>
      </Section>
    </div>
  )
}

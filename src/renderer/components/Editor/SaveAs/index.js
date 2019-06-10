import React from 'react'
import Svg from '../../Svg'
import Choice from '../../Shared/Choice'
import Checkbox from '../../Shared/Checkbox'
import NumberInput from '../../Shared/NumberInput'
import {
  Header,
  Main,
  Section,
  ChoiceRow,
  Property,
  Label,
  Footer,
  Button,
  PostLabel
} from '../Drawer/styles'
import styled from 'styled-components'
import { lighten } from 'polished'

export const Encoders = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  .divider {
    width: 1px;
    height: 14px;
    background: ${p => p.theme.grey[4]};
    margin-left: 1px;
    margin-right: 1px;
  }
`

export const Encoder = styled.div`
  font-size: 1.2rem;
  padding: 4px 4px;
  background: ${p => (p.selected ? lighten(0.35, p.theme.primary) : 'transparent')};
  &:hover {
    background: ${p =>
      p.selected ? lighten(0.35, p.theme.primary) : lighten(0.4, p.theme.primary)};
  }
`

export const RepeatCount = styled.div`
  display: flex;
  align-items: center;
  margin-left: 25px;
  margin-bottom: 10px;
`

export default function SaveAs({
  drawerHeight,
  saveMode,
  gifEncoder,
  gifLooped,
  gifForever,
  gifLoops,
  gifOptimize,
  gifQuality,
  setSaveMode,
  setGifEncoder,
  setGifLooped,
  setGifForever,
  setGifLoops,
  setGifOptimize,
  setGifQuality,
  onAccept,
  onCancel
}) {
  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='save' />
          <div className='text'>Save As</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={90}>
          <div className='title'>
            <div className='text'>File type</div>
            <div className='divider' />
          </div>
          <div>
            <ChoiceRow>
              <Choice
                selected={saveMode === 'gif'}
                icon={<Svg name='image' />}
                label='Gif'
                onClick={() => setSaveMode('gif')}
              />
              <Choice
                selected={saveMode === 'video'}
                icon={<Svg name='image' />}
                label='Video'
                onClick={() => setSaveMode('video')}
              />
            </ChoiceRow>
            <ChoiceRow>
              <Choice
                selected={saveMode === 'images'}
                icon={<Svg name='image' />}
                label='Images'
                onClick={() => setSaveMode('images')}
              />
              <Choice
                selected={saveMode === 'project'}
                icon={<Svg name='image' />}
                label='Project'
                onClick={() => setSaveMode('project')}
              />
            </ChoiceRow>
          </div>
        </Section>
        {saveMode === 'gif' && (
          <>
            <Section height={50}>
              <div className='title'>
                <div className='text'>Encoder</div>
                <div className='divider' />
              </div>
              <div>
                <Encoders>
                  <Encoder selected={gifEncoder === '2.0'} onClick={() => setGifEncoder('2.0')}>
                    2.0
                  </Encoder>
                  <div className='divider' />
                  <Encoder selected={gifEncoder === '1.0'} onClick={() => setGifEncoder('1.0')}>
                    1.0
                  </Encoder>
                  <div className='divider' />
                  <Encoder
                    selected={gifEncoder === 'ffmpeg'}
                    onClick={() => setGifEncoder('ffmpeg')}
                  >
                    FFmpeg
                  </Encoder>
                </Encoders>
              </div>
            </Section>
            <Section height={160}>
              <div className='title'>
                <div className='text'>Gif options</div>
                <div className='divider' />
              </div>
              {gifEncoder === '2.0' ? (
                <div>
                  <Checkbox
                    value={gifLooped}
                    primary='Looped Gif.'
                    style={{ marginLeft: '10px' }}
                    onClick={() => setGifLooped(!gifLooped)}
                  />
                  {gifLooped && (
                    <>
                      <Checkbox
                        value={gifForever}
                        primary='Repeat Forever.'
                        style={{ marginLeft: '20px' }}
                        onClick={() => setGifForever(!gifForever)}
                      />
                      <RepeatCount>
                        <NumberInput
                          width={60}
                          value={gifLoops}
                          max={100}
                          min={2}
                          fallback={2}
                          setter={setGifLoops}
                        />
                        <PostLabel>Repeat Count.</PostLabel>
                      </RepeatCount>
                    </>
                  )}
                  <Checkbox
                    value={gifOptimize}
                    primary='Detect unchanged pixels'
                    style={{ marginLeft: '10px' }}
                    onClick={() => setGifOptimize(!gifOptimize)}
                  />
                </div>
              ) : gifEncoder === '1.0' ? (
                <div>
                  <Checkbox
                    value={gifLooped}
                    primary='Looped Gif.'
                    style={{ marginLeft: '10px' }}
                    onClick={() => setGifLooped(!gifLooped)}
                  />
                  {gifLooped && (
                    <>
                      <Checkbox
                        value={gifForever}
                        primary='Repeat Forever.'
                        style={{ marginLeft: '20px' }}
                        onClick={() => setGifForever(!gifForever)}
                      />
                      <RepeatCount>
                        <NumberInput
                          width={60}
                          value={gifLoops}
                          max={100}
                          min={2}
                          fallback={2}
                          setter={setGifLoops}
                        />
                        <PostLabel>Repeat Count.</PostLabel>
                      </RepeatCount>
                    </>
                  )}
                  <Checkbox
                    value={gifOptimize}
                    primary='Detect unchanged pixels.'
                    style={{ marginLeft: '10px' }}
                    onClick={() => setGifOptimize(!gifOptimize)}
                  />
                </div>
              ) : gifEncoder === 'ffmpeg' ? (
                <div>ffmpeg</div>
              ) : (
                <div />
              )}
            </Section>
            <Section height={200}>
              <div className='title'>
                <div className='text'>Save options</div>
                <div className='divider' />
              </div>
            </Section>
          </>
        )}
      </Main>
      <Footer>
        <Button width={115} onClick={onAccept}>
          <Svg name='save' />
          <div className='text'>Save</div>
        </Button>
        <Button width={115} onClick={onCancel}>
          <Svg name='cancel' />
          <div className='text'>Cancel</div>
        </Button>
      </Footer>
    </>
  )
}

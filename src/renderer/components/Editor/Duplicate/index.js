import React from 'react'
import Svg from '../../Svg'
import NumberInput from '../../Shared/NumberInput'
import Select from '../../Shared/Select'
import { Header, Main, Section, Property, Label, Info, Footer, Button } from '../Drawer/styles'

const duplicateRemoveOptions = ['Remove First Frame', 'Remove Last Frame']

export default function Duplicate({
  drawerHeight,
  duplicatePercent,
  duplicateRemove,
  setDuplicatePercent,
  setDuplicateRemove,
  onAccept,
  onCancel
}) {
  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='delete' />
          <div className='text'>Remove Duplicates</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={200}>
          <div className='title'>
            <div className='text'>Remove duplicates</div>
            <div className='divider' />
          </div>
          <div>
            <Property>
              <Label width={90}>Similarity (%):</Label>
              <NumberInput
                width={80}
                value={duplicatePercent}
                max={100}
                min={10}
                fallback={90}
                setter={setDuplicatePercent}
              />
            </Property>
            <Property>
              <Label width={90}>Frame removal:</Label>
              <Select
                width={140}
                value={duplicateRemove}
                options={duplicateRemoveOptions}
                onClick={setDuplicateRemove}
              />
            </Property>
            <Info>
              <Svg name='info' />
              <div className='text'>
                This action analyzes each frame (pixel by pixel) and removes the ones that are at
                least {duplicatePercent}% similar to its immediate neighbor. You can chose if you
                want to adjust the delay (duration of exhibition) of the frames.
              </div>
            </Info>
          </div>
        </Section>
      </Main>
      <Footer>
        <Button width={115} onClick={onAccept}>
          <Svg name='check' />
          <div className='text'>Accept</div>
        </Button>
        <Button width={115} onClick={onCancel}>
          <Svg name='cancel' />
          <div className='text'>Cancel</div>
        </Button>
      </Footer>
    </>
  )
}

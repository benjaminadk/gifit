import React from 'react'
import Checkbox from '../Shared/Checkbox'
import NumberInput from '../Shared/NumberInput'
import { Section, CountdownSize } from './styles'

export default function Application({ options, onCheckboxClick, onCountdownTimeChange }) {
  return (
    <div>
      <Section height={200}>
        <div className='title'>
          <div className='text'>Screen Recorder</div>
          <div className='divider' />
        </div>
        <div className='content'>
          <Checkbox
            value={options.get('showCursor')}
            primary='Show the mouse cursor in the recording.'
            onClick={() => onCheckboxClick('showCursor')}
          />
          <Checkbox
            value={options.get('useCountdown')}
            primary='Use pre start countdown.'
            onClick={() => onCheckboxClick('useCountdown')}
          />
          {options.get('useCountdown') && (
            <CountdownSize>
              <NumberInput
                width={60}
                value={options.get('countdownTime')}
                min={2}
                max={15}
                fallback={3}
                setter={onCountdownTimeChange}
              />
              <div className='text'>(In seconds, wait before start capture.)</div>
            </CountdownSize>
          )}
        </div>
      </Section>
      <Section height={100}>
        <div className='title'>
          <div className='text'>Other</div>
          <div className='divider' />
        </div>
        <div className='content'>
          <Checkbox
            value={options.get('askDeleteFrame')}
            primary='Ask me before deleting frames.'
            onClick={() => onCheckboxClick('askDeleteFrame')}
          />
          <Checkbox
            value={options.get('askDiscardProject')}
            primary='Ask me before discarding project.'
            onClick={() => onCheckboxClick('askDiscardProject')}
          />
          <Checkbox
            value={options.get('askCloseEditor')}
            primary='Ask me before closing Editor.'
            secondary='If there is a project open'
            onClick={() => onCheckboxClick('askCloseEditor')}
          />
        </div>
      </Section>
    </div>
  )
}

import React, { useState } from 'react'
import { Slider, Handles, Ticks } from 'react-compound-slider'
import { rootStyle, Wrapper, RailStyles, HandleStyles, Tooltip, TickStyles } from './styles'

function Handle({ handle: { id, value, percent }, isActive, getHandleProps }) {
  const [mouseOver, setMouseOver] = useState(false)

  return (
    <>
      {mouseOver || isActive ? (
        <Tooltip left={percent}>
          <div className='tooltip'>{value}</div>
        </Tooltip>
      ) : null}
      <HandleStyles
        left={percent}
        {...getHandleProps(id, {
          onMouseEnter: () => setMouseOver(true),
          onMouseLeave: () => setMouseOver(false)
        })}
      />
    </>
  )
}

export default function RangeInput({ domain, values, tickCount }) {
  return (
    <Wrapper>
      <Slider rootStyle={rootStyle} domain={domain} values={values} step={1}>
        <RailStyles />
        <Handles>
          {({ handles, activeHandleID, getHandleProps }) => (
            <div className='slider-handles'>
              {handles.map(handle => (
                <Handle
                  key={handle.id}
                  handle={handle}
                  isActive={handle.id === activeHandleID}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
        <Ticks count={tickCount}>
          {({ ticks }) => (
            <div className='slider-ticks'>
              {ticks.map(tick => (
                <TickStyles key={tick.id} left={tick.percent} />
              ))}
            </div>
          )}
        </Ticks>
      </Slider>
    </Wrapper>
  )
}

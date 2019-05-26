import React from 'react'
import { Rnd } from 'react-rnd'
import { Background, Dimensions } from './styles'

const handleStyle = {
  width: 10,
  height: 10,
  background: '#FFF',
  border: '1px solid grey'
}

export default function SelectionOverlay({
  show,
  showHandles,
  screenWidth,
  screenHeight,
  selectWidth,
  selectHeight,
  selectX,
  selectY,
  setSelectWidth,
  setSelectHeight,
  setSelectX,
  setSelectY
}) {
  if (show) {
    return (
      <>
        <Rnd
          style={{
            visibility: selectWidth && selectHeight ? 'visible' : 'hidden',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            border: '1px dashed grey'
          }}
          bounds='parent'
          size={{ width: selectWidth, height: selectHeight }}
          position={{ x: selectX, y: selectY }}
          onDrag={(e, d) => {
            setSelectX(d.x)
            setSelectY(d.y)
          }}
          onResize={(e, direction, ref, delta, position) => {
            setSelectWidth(ref.offsetWidth)
            setSelectHeight(ref.offsetHeight)
            setSelectX(position.x)
            setSelectY(position.y)
          }}
          resizeHandleStyles={{
            top: {
              ...handleStyle,
              visibility: showHandles ? 'visible' : 'hidden',
              left: '50%',
              cursor: 'n-resize'
            },
            topRight: {
              ...handleStyle,
              visibility: showHandles ? 'visible' : 'hidden',
              right: '-5px',
              top: '-5px'
            },
            right: {
              ...handleStyle,
              visibility: showHandles ? 'visible' : 'hidden',
              top: '50%',
              cursor: 'e-resize'
            },
            bottomRight: {
              ...handleStyle,
              visibility: showHandles ? 'visible' : 'hidden',
              right: '-5px',
              bottom: '-5px'
            },
            bottom: {
              ...handleStyle,
              visibility: showHandles ? 'visible' : 'hidden',
              left: '50%',
              cursor: 'n-resize'
            },
            bottomLeft: {
              ...handleStyle,
              visibility: showHandles ? 'visible' : 'hidden',
              left: '-5px',
              bottom: '-5px'
            },
            left: {
              ...handleStyle,
              visibility: showHandles ? 'visible' : 'hidden',
              top: '50%',
              cursor: 'e-resize'
            },
            topLeft: {
              ...handleStyle,
              visibility: showHandles ? 'visible' : 'hidden',
              left: '-5px',
              top: '-5px'
            }
          }}
        >
          <Dimensions show={selectWidth > 100 && selectHeight > 100}>
            {selectWidth} x {selectHeight}
          </Dimensions>
        </Rnd>
        <Background top={0} left={0} width='full' height={selectY} />
        <Background top={selectY} left={0} width={selectX} height={selectHeight} />
        <Background
          top={selectHeight + selectY}
          left={0}
          width='full'
          height={screenHeight - 30 - selectHeight - selectY}
        />
        <Background
          top={selectY}
          left={selectWidth + selectX}
          width={screenWidth - selectWidth - selectX}
          height={selectHeight}
        />
      </>
    )
  } else {
    return null
  }
}

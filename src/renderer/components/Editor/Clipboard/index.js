import React from 'react'
import Svg from '../../Svg'
import { Header, Main, Section, Property, Label, Footer, Button } from '../Drawer/styles'
import styled from 'styled-components'
import { lighten } from 'polished'

export const List = styled.div`
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: ${p => p.theme.border};
  margin: 5px;
  padding: 1px;
`

export const Item = styled.div`
  display: grid;
  grid-template-columns: 40px 60px 60px 1fr;
  align-items: center;
  background: ${p => (p.selected ? lighten(0.35, p.theme.primary) : 'transparent')};
  border: 1px solid ${p => (p.selected ? p.theme.primary : 'transparent')};
  svg {
    width: 20px;
    height: 20px;
  }
  .time {
    color: ${p => p.theme.grey[5]};
  }
`

export default function Clipboard({ drawerHeight, clipboardItems, clipboardIndex, onCancel }) {
  return (
    <>
      <Header>
        <div className='left'>
          <Svg name='paste' />
          <div className='text'>Clipboard</div>
        </div>
        <div className='right'>
          <Svg name='close' onClick={onCancel} />
        </div>
      </Header>
      <Main height={drawerHeight}>
        <Section height={drawerHeight - 30}>
          <div className='title'>
            <div className='text'>Clipboard Entries</div>
            <div className='divider' />
          </div>
          <div>
            <List>
              {clipboardItems.map((el, i) => (
                <Item key={i} selected={i === clipboardIndex}>
                  <Svg name='image' />
                  <div>1 Image</div>
                  <div>07:20:46</div>
                  <Svg name='check' />
                </Item>
              ))}
            </List>
          </div>
        </Section>
      </Main>
      <Section style={{ transform: 'translateY(-15px)' }} height={70}>
        <div className='title'>
          <div className='text'>Paste Behavior</div>
          <div className='divider' />
        </div>
        <div>
          <div>Before selected frame</div>
          <div>After selected frame</div>
        </div>
      </Section>
    </>
  )
}

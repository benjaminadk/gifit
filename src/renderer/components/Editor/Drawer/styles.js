import styled from 'styled-components'
import { lighten } from 'polished'
import config from 'common/config'

const {
  editor: { drawerWidth }
} = config

export const Container = styled.div.attrs(p => ({
  style: {
    top: p.shiftUp ? '120px' : '25px',
    right: p.show ? '0' : `-${drawerWidth}px`,
    bottom: p.thumbHeight ? p.thumbHeight + 40 + 20 + 'px' : '120px'
  }
}))`
  position: absolute;
  width: ${drawerWidth}px;
  background: ${p => p.theme.grey[0]};
  border-left: ${p => p.theme.border};
  transition: top 0.25s, right 0.25s;
`

export const Layout = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 40px 1fr 50px;
`

export const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr 1fr;
  .left {
    display: grid;
    grid-template-columns: 50px 1fr;
    align-items: center;
    svg {
      justify-self: center;
      width: 30px;
      height: 30px;
    }
    .text {
      font-size: 1.2rem;
    }
  }
  .right {
    display: grid;
    justify-items: flex-end;
    align-items: center;
    svg {
      width: 30px;
      height: 30px;
      padding: 5px;
      margin-right: 10px;
      &:hover {
        background: ${p => lighten(0.4, p.theme.primary)};
      }
    }
  }
`

export const Main = styled.main`
  height: ${p => p.height}px;
  overflow: auto;
  padding-top: 5px;
  transition: 0.25s;
`

export const Section = styled.div`
  position: relative;
  height: ${p => p.height}px;
  display: grid;
  grid-template-rows: 20px 1fr;
  .title {
    display: flex;
    .text {
      font-size: 1.2rem;
      white-space: nowrap;
      margin-left: 3px;
      margin-right: 3px;
    }
    .divider {
      width: 100%;
      height: 1px;
      background: ${p => p.theme.grey[2]};
      margin-top: 7px;
    }
  }
`

export const ChoiceRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  align-items: center;
`

export const Property = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

export const Label = styled.div`
  width: ${p => p.width}px;
  font-size: 1.2rem;
  margin-left: 10px;
`

export const Footer = styled.footer`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  align-items: center;
`

export const Button = styled.div`
  width: ${p => p.width}px;
  height: 35px;
  display: grid;
  grid-template-columns: 40px 1fr;
  justify-items: center;
  align-items: center;
  background: #fff;
  border: ${p => p.theme.border};
  &:hover {
    border: 1px solid ${p => p.theme.primary};
    background: ${p => lighten(0.4, p.theme.primary)};
  }
  svg {
    width: 25px;
    height: 25px;
  }
  .text {
    font-size: 1.2rem;
  }
`

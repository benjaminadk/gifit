import styled from 'styled-components'
import { lighten, darken } from 'polished'

export const Container = styled.div`
  height: ${p => (p.show ? '120px' : '25px')};
  display: grid;
  grid-template-rows: 25px 1fr;
  border-bottom: ${p => p.theme.border};
  transition: height 0.25s;
`

export const Tabs = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 80px 90px 105px 80px 85px 100px 100px 1fr 100px;
  justify-items: center;
  align-items: center;
  background: ${p => p.theme.grey[1]};
  border-bottom: ${p => p.theme.border};
`

export const Tab = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 30px 1fr;
  align-items: center;
  background: ${p => (p.selected ? '#FFFFFF' : 'transparent')};
  color: ${p => (p.selected ? darken(0.2, p.theme.primary) : '#000000')};
  border: ${p => (p.selected ? p.theme.border : `1px solid ${p.theme.grey[1]}`)};
  border-bottom: 0;
  &:hover {
    color: ${p => darken(0.2, p.theme.primary)};
  }
  svg {
    justify-self: flex-end;
    width: 15px;
    height: 15px;
  }
  .text {
    padding-left: 5px;
    font-size: 1.2rem;
  }
  .divider {
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${p => (p.selected ? '#FFFFFF' : 'transparent')};
  }
`

export const Extras = styled.div`
  font-size: 1.2rem;
`

export const Menu = styled.div`
  position: relative;
  display: ${p => (p.show ? 'flex' : 'none')};
  padding-top: 5px;
  padding-bottom: 5px;
`

export const Collapse = styled.div`
  position: absolute;
  right: 5px;
  bottom: 0;
  svg {
    width: 20px;
    height: 20px;
  }
`

export const Section = styled.div`
  width: ${p => p.width}px;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 15px;
  background: #ffffff;
  border-right: 1px solid ${p => p.theme.grey[2]};
`

export const SectionText = styled.div`
  align-self: flex-end;
  justify-self: center;
  margin-bottom: -3px;
  font-size: 1.2rem;
  color: ${p => p.theme.grey[7]};
`

export const GenericGrid = styled.div`
  display: grid;
  grid-template-columns: ${p => `repeat(${p.columns}, 75px)`};
`

export const Zoom = styled.div`
  display: grid;
  grid-template-columns: 75px 75px 150px;
`

export const General = styled.div`
  display: grid;
  grid-template-columns: 100px 100px 125px 125px;
`

export const Action = styled.div`
  justify-self: center;
  width: 90%;
  height: 105%;
  display: grid;
  grid-template-rows: 1fr 1fr;
  justify-items: center;
  grid-gap: 5px;
  &:hover {
    background: ${p => lighten(0.42, p.theme.primary)};
  }
  svg {
    align-self: flex-end;
    width: 30px;
    height: 30px;
  }
  .text {
    text-align: center;
    font-size: 1.2rem;
  }
  .fit {
    outline: 1px dashed;
  }
`

export const ZoomInput = styled.div`
  justify-self: center;
  align-self: center;
  display: grid;
  grid-template-columns: 25px 80px 15px;
  justify-items: center;
  align-items: center;
  svg {
    width: 20px;
    height: 20px;
  }
  .text {
    font-size: 1.2rem;
  }
`

export const Statistic = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  font-size: 1.2rem;
  .top {
    justify-self: center;
    align-self: flex-end;
    display: grid;
    grid-template-columns: 20px 1fr;
    align-items: center;
    svg {
      justify-self: center;
      width: 15px;
      height: 15px;
    }
  }
  .bottom {
    display: grid;
    justify-items: center;
    align-items: center;
    color: ${p => darken(0.1, p.theme.primary)};
    margin-left: 20px;
  }
`

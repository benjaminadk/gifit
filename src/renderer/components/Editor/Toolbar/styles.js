import styled from 'styled-components'
import { lighten, darken } from 'polished'

export const Container = styled.div`
  height: 120px;
  display: grid;
  grid-template-rows: 25px 1fr;
  border-bottom: ${p => p.theme.border};
`

export const Tabs = styled.div`
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
  border: ${p => (p.selected ? p.theme.border : `1px solid ${p.theme.grey[1]}`)};
  border-bottom: 0;
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
  display: flex;
  padding-top: 5px;
  padding-bottom: 5px;
`

export const Section = styled.div`
  width: ${p => p.width}px;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 15px;
  border-right: 1px solid ${p => p.theme.grey[2]};
`

export const SectionText = styled.div`
  align-self: flex-end;
  justify-self: center;
  margin-bottom: -3px;
  font-size: 1.2rem;
  color: ${p => p.theme.grey[7]};
`

export const New = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 75px);
`

export const File = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 75px);
`

export const Zoom = styled.div`
  display: grid;
  grid-template-columns: 75px 75px 150px;
`

export const Selection = styled.div`
  display: grid;
  grid-template-columns: 75px 75px 75px;
`

export const Playback = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 75px);
`

export const Frames = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 75px);
`

export const Rotation = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 75px);
`

export const Text = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 75px);
`

export const Overlay = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 75px);
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
    width: 20px;
    height: 20px;
  }
  .text {
    text-align: center;
    font-size: 1.2rem;
  }
  .expand {
    transform: rotate(45deg);
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

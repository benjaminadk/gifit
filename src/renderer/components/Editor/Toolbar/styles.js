import styled from 'styled-components'

export const Container = styled.div`
  height: 100px;
  display: grid;
  grid-template-rows: 25px 1fr;
  border-bottom: ${p => p.theme.border};
`

export const Tabs = styled.div`
  display: grid;
  grid-template-columns: 80px 90px 105px 80px 85px;
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

export const Menu = styled.div`
  display: flex;
`

export const Section = styled.div`
  width: ${p => p.width}px;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 15px;
  border-right: ${p => p.theme.border};
`

export const SectionText = styled.div`
  align-self: center;
  justify-self: center;
  color: ${p => p.theme.grey[5]};
`

export const New = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 75px);
`

export const Action = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  justify-items: center;
  grid-gap: 5px;
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

export const File = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 75px);
`

export const Zoom = styled.div`
  display: grid;
  grid-template-columns: 75px 75px 150px;
`

export const Playback = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 50px);
`

export const Frames = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 50px);
`

export const Text = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 50px);
`

export const Overlay = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 50px);
`

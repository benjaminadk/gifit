import styled from 'styled-components'

export const Container = styled.div.attrs(p => ({
  style: {
    right: p.show ? '0' : `-${p.width}px`
  }
}))`
  position: absolute;
  top: 100px;
  bottom: 100px;
  width: ${p => p.width}px;
  border-left: ${p => p.theme.border};
  transition: right 0.5s;
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
    grid-template-columns: 30px 1fr;
    align-items: center;
    svg {
      width: 25px;
      height: 25px;
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
    }
  }
`

export const Main = styled.main`
  padding-top: 5px;
`

export const Section = styled.div`
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

export const ColorSwatch = styled.div`
  width: ${p => p.width}px;
  height: 25px;
  background: ${p => p.color};
  outline: ${p => p.theme.border};
  cursor: pointer;
  &:hover {
    outline: 1px solid ${p => p.theme.primary};
  }
  input[type='color'] {
    display: none;
  }
`

export const Footer = styled.footer`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  align-items: center;
`

export const Button = styled.div`
  width: ${p => p.width}px;
  height: 40px;
  display: grid;
  grid-template-columns: 30px 1fr;
  justify-items: center;
  align-items: center;
  border: ${p => p.theme.border};
  svg {
    width: 25px;
    height: 25px;
  }
  .text {
    font-size: 1.2rem;
  }
`

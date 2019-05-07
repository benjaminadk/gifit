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
    }
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

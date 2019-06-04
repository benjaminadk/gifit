import styled from 'styled-components'

export const rootStyle = {
  position: 'relative',
  width: '90%',
  height: 80
}

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  align-items: center;
  justify-items: center;
`

export const RailStyles = styled.div`
  position: absolute;
  width: 100%;
  height: 4px;
  margin-top: 35px;
  border: ${p => p.theme.border};
  background: #ffffff;
`

export const HandleStyles = styled.div.attrs(p => ({
  style: {
    left: p.left + '%'
  }
}))`
  position: absolute;
  width: 10px;
  height: 20px;
  margin-top: 25px;
  margin-left: -5px;
  border: ${p => p.theme.border};
  background: #ffffff;
`

export const Tooltip = styled.div.attrs(p => ({
  style: {
    left: p.left + '%'
  }
}))`
  position: absolute;
  margin-left: -10px;
  margin-top: 0px;
  .tooltip {
    width: 20px;
    height: 20px;
    display: grid;
    align-items: center;
    justify-items: center;
    border: ${p => p.theme.border};
    background: #ffffff;
    font-size: 1.2rem;
  }
`

export const TickStyles = styled.div`
  position: absolute;
  left: ${p => p.left}%;
  width: 1px;
  height: 3px;
  margin-top: 45px;
  margin-left: -0.5px;
  background: ${p => p.theme.grey[5]};
`

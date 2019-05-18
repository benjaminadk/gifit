import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  height: 100px;
  display: grid;
  grid-template-rows: 20px 1fr;
  padding: 5px;
  background: ${p => p.theme.grey[0]};
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
  .content {
    display: grid;
    grid-template-rows: 1fr 40px;
    justify-items: center;
    align-items: center;
    input {
      width: 100%;
    }
  }
`

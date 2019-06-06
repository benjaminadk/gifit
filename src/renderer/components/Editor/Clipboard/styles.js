import styled from 'styled-components'
import { lighten } from 'polished'

export const List = styled.div`
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: ${p => p.theme.border};
  margin: 5px;
  padding: 1px;
`

export const Item = styled.div`
  display: grid;
  grid-template-columns: 30px 60px 60px 1fr;
  align-items: center;
  background: ${p => (p.selected ? lighten(0.4, p.theme.primary) : 'transparent')};
  border: 1px solid ${p => (p.selected ? p.theme.primary : 'transparent')};
  font-size: 1.2rem;
  padding-top: 4px;
  padding-bottom: 4px;
  &:hover {
    background: ${p =>
      p.selected ? lighten(0.4, p.theme.primary) : lighten(0.45, p.theme.primary)};
    border: 1px solid ${p => (p.selected ? p.theme.primary : lighten(0.1, p.theme.primary))};
  }
  svg {
    justify-self: center;
    width: 20px;
    height: 20px;
  }
  .time {
    color: ${p => p.theme.grey[10]};
  }
  .check {
    justify-self: flex-end;
    margin-right: 10px;
  }
`

export const Radios = styled.div`
  height: 40px;
  display: grid;
  grid-template-rows: 1fr 1fr;
  align-items: center;
  .option {
    display: grid;
    grid-template-columns: 40px 1fr;
    align-items: center;
    font-size: 1.2rem;
  }
  svg {
    justify-self: center;
    width: 12px;
    height: 12px;
  }
`

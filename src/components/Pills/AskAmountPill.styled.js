import styled from 'styled-components'
import { MediaQueries, TextStyles, ColorStyles } from '../../theme/theme'
import ButtonFilled from '../Button/ButtonFilled/ButtonFilled'

export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3.25rem;
  padding: 0.625rem 1.0625rem 0.625rem 0.625rem;

  ${MediaQueries.Bundler(MediaQueries.md)} {
    height: 4.659rem;
    padding: 1.022rem 1.59rem 1.022rem 1.022rem;
  }
`
export const InnerContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const CoinSelectDiv = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
`
export const CoinSelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
`
export const CoinImageDiv = styled.div`
  display: flex;
  align-items: center;
`
export const Image = styled.img`
  height: 1.4375rem;
  width: 1.4375rem;
  object-fit: contain;
  ${({ isSemiTransparent }) => (isSemiTransparent ? 'opacity: 0.3' : '')};
  ${({ small }) =>
    small
      ? `
    width: 0.875rem;
    height: 0.875rem;
  `
      : ''}
  ${({ mixed }) =>
    mixed
      ? `
    position: relative
  `
      : ''}
  ${({ coinIndex }) =>
    coinIndex === 1
      ? 'z-index: 1'
      : coinIndex === 2
      ? `
      z-index: 2;
      margin-left: -9px;`
      : coinIndex === 3
      ? `
      z-index: 3;
      margin-left: -9px;`
      : ''}
  
  ${MediaQueries.Bundler(MediaQueries.md)} {
    height: 1.4772rem;
    width: 1.4772rem;
  }
`
export const MixImageDiv = styled.div`
  display: flex;
  align-items: flex-start;
`

export const CoinName = styled.p`
  margin-left: 0.4375rem;
  text-transform: uppercase;
  margin-right: auto;
  margin-top: 0.25rem;
  text-transform: ${({ option }) =>
    option === 'mix' ? 'capitalize' : 'uppercase'};
  position: relative;

  ${MediaQueries.Bundler(MediaQueries.md)} {
  }
`
export const CoinNameSpan = styled.span`
  text-transform: uppercase;
  margin-left: 0.2rem;
`

export const DropDownMenu = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.8125rem 0.625rem;
  position: absolute;
  right: auto;
  /* left: 0;
  top: 100%; */
  /* top: 0.375rem; */
  background: ${ColorStyles.Colors.DarkBg};
  box-shadow: 6px 6px 15px rgba(0, 0, 0, 0.06);
  z-index: 100;

  ${({ longName }) =>
    longName
      ? `
  width: 20rem;
  `
      : `
  width: 15rem;
  `}

  & > * {
    z-index: 100;
  }
`
export const DropDownOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  :hover {
    background: ${ColorStyles.Colors.DarkBg};
  }
  padding: 0.2rem;
  border-radius: 6px;

  /* ${({ option }) => (option === 'cash' ? '' : '')} */
`
export const DropDownCoinSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  background: ${ColorStyles.Colors.Cards.DarkTint};
  color: ${ColorStyles.Colors.White};
  border-radius: 0.1875rem;
  position: relative;
  width: 0.875rem;
  padding: 0.4375rem 0.5625rem 0.4375rem 0.4375rem;

  :hover {
    background: ${ColorStyles.Colors.DarkBg};
  }

  ${MediaQueries.Bundler(MediaQueries.md)} {
    ${({ longName }) =>
      longName
        ? `
    width: 20rem;
    `
        : `
    width: 15rem;
    `}
    padding: 0.625rem 0.738rem 0.3977rem 0.568rem;
  }
`
export const DownCaretDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: flex-end;
`

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`
export const Input = styled.input`
  border: none;
  outline: none;
  text-align: right;
  background-color: transparent;
  color: ${ColorStyles.Colors.Yellow};

  ${MediaQueries.Bundler(MediaQueries.md)} {
    color: ${ColorStyles.Colors.Yellow};
  }
`
export const ExpectedValueDiv = styled.div`

  ${MediaQueries.Bundler(MediaQueries.md)} {
  }
`
export const BalanceDiv = styled.div`
  display: flex;
  align-items: center;

  ${MediaQueries.Bundler(MediaQueries.md)} {
  }
`
export const MaxButton = styled(ButtonFilled)`
  font-size: 0.4rem;
  line-height: 0.5rem;
  padding: 0.1rem 0.2rem;
  border-radius: 0.1875rem;
  margin-right: 0.5rem;

  ${MediaQueries.Bundler(MediaQueries.md)} {
    ${TextStyles.Bundler(TextStyles.Desktop.Buttons.Semi18)}
    font-size: 0.90rem;
    line-height: 1rem;
  }
`

export const CoinSplitsDiv = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #cdd7e0;
  margin-left: -10px;
  margin-right: -24px;
  padding-left: 10px;
  padding-right: 24px;
  margin-top: 10px;
  padding-top: 4px;
`
export const CoinSplit = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.375rem;
`
export const CoinSplitInnerContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
export const CoinSplitCoinName = styled.div`
  text-transform: uppercase;
  margin-left: 0.3125rem;
`
export const FlexDiv = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-end;
`

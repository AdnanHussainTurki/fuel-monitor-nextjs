import styled from 'styled-components'
import { ColorStyles, MediaQueries, TextStyles } from '../../../theme/theme'

export const StyledButton = styled.button`
  position: relative;
  display: block;
  padding: 10px 30px;
  text-align: center;
  text-decoration: none;
  border: none;
  ${({disabled}) => disabled ? `
  color: ${ColorStyles.Colors.White};
  ` : `
  color: ${ColorStyles.Colors.Text.LightBlack};
  ` }
  background: ${ColorStyles.Gradients.LemonGreen};
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
  transition: 0.5s;

  &:hover {
    background: ${ColorStyles.Gradients.LemonGreen};
    backdrop-filter: blur(21px);
    ${({ disabled, glow }) =>
      disabled || !glow
        ? `
    box-shadow: none;
    `
        : `
    box-shadow: 0px 0px 22px 1px ${ColorStyles.Colors.Green};
    
    `}
  }

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    ${({ borderNone, disabled }) =>
      borderNone || disabled
        ? `
    border: none;
    `
        : `
    border: 3px solid ${ColorStyles.Colors.Green};
    `}
    z-index: 1;
    transition: 0.5s;

    ${({ borderSmall }) =>
      borderSmall
        ? `
    top: -4px;
    left: -4px;
    `
        : `
    top: -7px;
    left: -7px;
    `}
  }

  &:hover:after {
    top: 0px;
    left: 0px;
    ${({ borderNone, disabled }) =>
      borderNone || disabled
        ? `
    border: none;
    `
        : `
    border: 3px solid ${ColorStyles.Colors.Green};
    `}
  }

  &:disabled {
    background: ${ColorStyles.Colors.Buttons.Filled.Disabled};
    cursor: not-allowed;

    &:active {
      opacity: 1;
    }
  }
`

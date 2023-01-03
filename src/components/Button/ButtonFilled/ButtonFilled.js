import React from 'react'
import styled from 'styled-components'
import { ColorStyles, TextStyles } from '../../../theme/theme'

const ButtonFilled = ({ children, disabled, className, onClick, hidden }) => {
  return (
    <Button
      className={className}
      hidden={hidden}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export default ButtonFilled

const Button = styled.button`
  background: ${ColorStyles.Colors.Buttons.Filled.ActiveState};
  padding: 0.75rem 2.25rem;
  border: none;
  outline: none;
  color: ${ColorStyles.Colors.White};
  ${TextStyles.Bundler(TextStyles.Desktop.Buttons.Semi18)};
  white-space: nowrap;

  &:hover {
    background: ${ColorStyles.Colors.Buttons.Filled.HoverState};
  }

  &:active {
    opacity: 0.7;
  }

  &:disabled {
    background: ${ColorStyles.Colors.Buttons.Filled.Disabled};
    cursor: not-allowed;

    &:active {
      opacity: 1;
    }
  }
`

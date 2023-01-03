import React from 'react'
import styled from 'styled-components'
import { ColorStyles, MediaQueries, TextStyles } from '../../../theme/theme'

const ButtonOutline = ({ children, disabled = false, className }) => {
  return (
    <Button className={className} disabled={disabled}>
      <InnerDiv disabled={disabled}>{children}</InnerDiv>
    </Button>
  )
}

export default ButtonOutline

const Button = styled.button`
  border: 1px solid transparent;
  background: inherit;
  white-space: nowrap;

  &:hover {
    background: ${ColorStyles.Colors.Buttons.Outline.HoverState};
  }

  &:active {
    background-color: ${ColorStyles.Colors.White};
    border: 0.0625rem solid;
    border-image-slice: 1;
    border-width: 0.0625rem;
    border-image-source: ${ColorStyles.Colors.Buttons.Outline.ActiveState};
  }

  &:disabled {
    background-color: ${ColorStyles.Colors.White};
    cursor: not-allowed;
    border: 0.0625rem solid ${ColorStyles.Colors.Buttons.Outline.Disabled};
  }
`
export const InnerDiv = styled.div`
  background: inherit;
  padding: 0.875rem 1.5rem;
  outline: none;
  ${TextStyles.Bundler(TextStyles.Mobile.Buttons.Semi16)};
  white-space: nowrap;
  display: flex;
  align-items: center;
  &:hover {
    ${({ disabled }) =>
      disabled
        ? `color: ${ColorStyles.Colors.Text.LightGray};`
        : `background: ${ColorStyles.Colors.Buttons.Filled.HoverState};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;`}
  }
  ${({ disabled }) =>
    disabled
      ? `color: ${ColorStyles.Colors.Text.LightGray};`
      : `background: ${ColorStyles.Colors.Buttons.Outline.ActiveState};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;`}

  ${MediaQueries.Bundler(MediaQueries.md)} {
    ${TextStyles.Bundler(TextStyles.Desktop.Buttons.Semi18)};
    padding: 0.681rem 2.04rem;
  }
`

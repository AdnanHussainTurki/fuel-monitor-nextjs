import React from 'react'
import * as C from './BorderedButton.styled'

const BorderedButton = ({
  children,
  disabled = false,
  className,
  onClick,
  glow = false,
  borderSmall,
  borderNone = false,
}) => {
  return (
    <C.StyledButton
      className={className}
      disabled={disabled}
      onClick={onClick}
      glow={glow}
      borderSmall={borderSmall}
      borderNone={borderNone}
    >
      {children}
    </C.StyledButton>
  )
}

export default BorderedButton

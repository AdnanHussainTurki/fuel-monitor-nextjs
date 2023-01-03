import { createGlobalStyle } from 'styled-components'
import { ColorStyles, TextStyles } from './theme'

const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

a {
  text-decoration: none;
  color: ${ColorStyles.Colors.LightGreen};
}

a:hover {
  background: ${ColorStyles.Colors.Black};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

p {
  margin-bottom: 0rem !important;
}

button {
  cursor: pointer;
}


::-webkit-scrollbar {
  width: 14px;
  height: 100vh;
  background-color: ${ColorStyles.Colors.LayoutBg};
  margin-block: 0.5em;
}

::-webkit-scrollbar-track {
  margin-block: 0.5em;
}

::-webkit-scrollbar-thumb {
  border: 3px solid rgba(255, 255, 255, 0);
  border-radius: 999rem;
  background-clip: padding-box;
  background-color: #05503C;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #00321D;
}

@supports (scrollbar-color: #00321D #05503C) {
  * {
    scrollbar-color: #00321D #05503C;
    scroll-behavior: smooth;
  }
}


body {
  ${TextStyles.Bundler(TextStyles.Mobile.Body.Regular15)}
  
  @media screen and (min-width: 768px) {
      ${TextStyles.Bundler(TextStyles.Desktop.Body.Regular16)}
  }
}

`
export default GlobalStyle

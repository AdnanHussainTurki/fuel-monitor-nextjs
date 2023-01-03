export const TextStyles = {
  Desktop: {
    // Headings: {
    //   H1: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '3.068rem',
    //     FontWeight: 700,
    //     LineHeight: '3.63',
    //   },
    //   H2: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '2.727rem',
    //     FontWeight: 600,
    //     LineHeight: '2.23',
    //   },
    //   H3: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '1.988rem',
    //     FontWeight: 600,
    //     LineHeight: '2',
    //   },
    //   H4: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '1.59rem',
    //     FontWeight: 500,
    //     LineHeight: '1.875',
    //   },
    //   H5: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '1.36rem',
    //     FontWeight: 500,
    //     LineHeight: '1.36',
    //   },
    // },
    // Body: {
    //   Regular18: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '1.0227rem',
    //     FontWeight: 500,
    //     LineHeight: '1.420',
    //   },
    //   Regular17: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '1rem',
    //     FontWeight: 500,
    //     LineHeight: '1.136',
    //   },
    //   Regular16: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '0.909rem',
    //     FontWeight: 500,
    //     LineHeight: '1.363',
    //   },
    //   Regular15: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '0.852rem',
    //     FontWeight: 400,
    //     LineHeight: '1.25',
    //   },
    //   Regular13: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '0.738rem',
    //     FontWeight: 400,
    //     LineHeight: '1.136',
    //   },
    //   Regular12: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '0.681rem',
    //     FontWeight: 400,
    //     LineHeight: '1.0227',
    //   },
    // },
    Buttons: {
      Semi28: {
        FontFamily: 'Source Code Pro,  monospace',
        FontSize: '1.59rem',
        FontWeight: 600,
        LineHeight: '2.045',
      },
      Semi24: {
        FontFamily: 'Source Code Pro, monospace',
        FontSize: '1.363rem',
        FontWeight: 600,
        LineHeight: '1.70',
      },
      Semi20: {
        FontFamily: 'Source Code Pro, monospace',
        FontSize: '1.136rem',
        FontWeight: 600,
        LineHeight: '1.420',
      },
      Semi18: {
        FontFamily: 'Source Code Pro, monospace',
        FontSize: '1.022rem',
        FontWeight: 600,
        LineHeight: '1.306',
      },
    },
  },
  Mobile: {
    // Headings: {
    //   H1: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '2.1875rem',
    //     FontWeight: 700,
    //     LineHeight: '2.625',
    //   },
    //   H2: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '1.75rem',
    //     FontWeight: 700,
    //     LineHeight: '2.0625',
    //   },
    //   H3: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '1.5rem',
    //     FontWeight: 700,
    //     LineHeight: '1.8125',
    //   },
    //   H4: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '1.25rem',
    //     FontWeight: 700,
    //     LineHeight: '1.5',
    //   },
    //   H5: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '1.125rem',
    //     FontWeight: 700,
    //     LineHeight: '1.3125',
    //   },
    // },
    // Body: {
    //   Regular15: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '0.9375rem',
    //     FontWeight: 300,
    //     LineHeight: '1.3125',
    //   },
    //   Regular13: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '0.8125rem',
    //     FontWeight: 300,
    //     LineHeight: '1.125',
    //   },
    //   Regular12: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '0.75rem',
    //     FontWeight: 300,
    //     LineHeight: '1.0625',
    //   },
    //   Regular11: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '0.6875rem',
    //     FontWeight: 300,
    //     LineHeight: '0.9375',
    //   },
    //   Regular9: {
    //     FontFamily: 'Source Code Pro, monospace',
    //     FontSize: '0.5625rem',
    //     FontWeight: 300,
    //     LineHeight: '0.8125',
    //   },
    // },
    Buttons: {
      Semi18: {
        FontFamily: 'Source Code Pro, monospace',
        FontSize: '1.125rem',
        FontWeight: 600,
        LineHeight: '1.4375',
      },
      Semi16: {
        FontFamily: 'Source Code Pro, monospace',
        FontSize: '1rem',
        FontWeight: 600,
        LineHeight: '1.25',
      },
    },
  },

  Bundler: function (attr) {
    return `
      font-family: ${attr.FontFamily};
      font-size: ${attr.FontSize};
      font-weight:  ${attr.FontWeight};
      line-height: ${attr.LineHeight};
      `
  },
}

export const ColorStyles = {
  Cards: {
    GlassCardStroke: '#FFFFFF',
    GlassCard:
      'linear-gradient(143.93deg, rgba(250, 250, 250, 0.53) 11.44%, rgba(239, 239, 239, 0) 100%)',
  },
  Gradients: {
    MintGreen: 'linear-gradient(80.09deg, #70F27D 4.84%, #70F2D2 92.56%)',
    MintBlue: 'linear-gradient(80.09deg, #6CE9FC 4.84%, #4498F8 92.56%)',
    Orpink: 'linear-gradient(80.09deg, #EC7230 4.84%, #DB3277 92.56%)',
    Instup:
      'linear-gradient(80.09deg, #ED813A 4.84%, #B05AC4 49.16%, #4C37E0 92.56%)',
    StrokeGreen:
      'linear-gradient(165.47deg, #43C563 3.62%, rgba(67, 197, 99, 0) 102.42%)',
    BgGreen: 'linear-gradient(134.45deg, #021A13 12.16%, #018663 88.29%)',
    Greeene: 'linear-gradient(145.72deg, #021A13 12.2%, #018663 99.09%)',
    DarkNavbar:
      'linear-gradient(180deg, #000000 0%, #000000 28.13%, rgba(0, 0, 0, 0) 100%)',
    GreenFade:
      'linear-gradient(105.21deg, #004210 3.05%, rgba(15, 168, 52, 0) 94.26%)',
    LemonGreen: 'linear-gradient(272.25deg, #D0E746 -29.53%, #49D587 84.34%);',
  },
  Colors: {
    Cream: '#F5F5F5',
    LightCream: '#FDFDFD',
    White: '#FFFFFF',
    Black: '#000000',
    DarkBg: '#1E1E1E',
    Yellow: '#D0E746',
    LayoutBg: '#000204',
    DullGray: '#727272',
    Gray: '#878787',
    SubtleGray: '#D4D4D4',
    FantomBlue: '#096CAF',
    SkyBlue: '#B6D7ED',
    DarkGreen: '#0C581F',
    Blue: '#004C80',
    DarkButton: '#141414',
    DarkBlue: '#2009AF',
    Purple: '#3B38D2',
    Aquamarine: '#7FFFD4',
    DarkYellow: '#AE7C00',
    DullPink: '#B243C5',
    Slate: '#BAB6ED',
    Orange: '#CA2F0D',
    Green: '#32934A',
    Pink: '#D100B1',
    NewGreen: '#49D487',
    LightGold: '#EDB6B6',
    LightGray: '#696969',
    LightYellow: '#FFFAD1',
    LightGreen: '#2BD755;',
    LightBlue: '#F2F5FF',
    Buttons: {
      Filled: {
        Disabled: '#0000',
        ActiveState:
          'linear-gradient(92.23deg, #08A97C 0.48%, #0AE496 103.21%)',
        HoverState: 'linear-gradient(92.23deg, #0F8563 0.48%, #0EC685 103.21%)',
      },
      Outline: {
        Disabled: '#DEE8E6',
        ActiveState:
          'linear-gradient(92.23deg, #08A97C 0.48%, #0AE496 103.21%)',
        HoverState: '#EAF8F3',
      },
    },
    Text: {
      DarkGray: '#727272',
      White: '#ffffff',
      LightGray: '#878787',
      SubtleCream: '#F5F5F5',
      AccentGreen: '#43C563',
      DarkGreen: '#033636',
      LavenderBlue: '#699EDB',
      LightBlack: '#050505',
    },
    Cards: {
      StrokeGray: '#111111',
      DarkTint: '#1C1D1D',
      GrayNeutral: '#131313',
    },
  },
  BrandColors: {
    Faip: '#EEEEFF',
    Rid: '#E63946',
    Glowgrin: '#28CFB8',
    Graygrin: '#41A497',
    Darkblue: '#1D3557',
  },
}

export const EffectStyles = {
  GlassCardBlur: {
    Background: '#D9D9D9',
    BackdropFilter: 'blur(25px)',
  },
  Shadows: {
    ShadowCard: {
      Background: '#D9D9D9',
      BoxShadow: '1.5px 1.5px 6px rgba(0, 0, 0, 0.09)',
    },
    SmoothShadow: {
      Background: '#D9D9D9',
      BoxShadow: '6px 6px 15px rgba(0, 0, 0, 0.06)',
    },
    PerformanceCard: {
      Background: '#FFFFFF',
      BoxShadow: '3.98242px 3.98242px 9.95604px rgba(0, 0, 0, 0.06)',
    },
    Bundler: function (attr) {
      return `
      background: ${attr.Background};
      box-shadow:  ${attr.BoxShadow};
      `
    },
  },
  Bundler: function (attr) {
    return `
      background: ${attr.Background};
      backdrop-filter:  ${attr.BackdropFilter};
      `
  },
}

export const MediaQueries = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  Bundler: function (attr) {
    return `
      @media screen and (min-width:${attr})
    `
  },
}

"use client";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";
import StyledJsxRegistry from "./registry";

function ThemeProvider(props: PropsWithChildren) {
  const theme = createTheme({
    cssVariables: {
      colorSchemeSelector: "class",
    },
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: "#2a58a8",
            contrastText: "#f5f5f5",
            light: "#5682c2"
          },
          secondary: {
            main: "#c8da2c",
            contrastText: "#c56aaa",
          },
          text: {
            primary: "#0f0f35",
          }
        },
      },
      dark: {
        palette: {
          primary: {
            main: "#c56aaa",
            light: "#c56aaa",
          },
          secondary: {
            main: "#c56aaa",
            contrastText: "#2a58a8",
          },
          text: {
            primary: "#f5f5f5",
          }
        },
      },
    },

    typography: {
      fontFamily: [
        'Chakra Petch',
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontFamily: [
          'Microgramma D Extended',
          'Chakra Petch',
          'Roboto',
          'sans-serif',
        ].join(','),
        fontWeight: 700,
      },
      h2: {
        fontFamily: [
          'Microgramma D Extended',
          'Chakra Petch',
          'Roboto',
          'sans-serif',
        ].join(','),
        fontWeight: 700,
      },
      h3: {
        fontFamily: [
          'Microgramma D Extended',
          'Chakra Petch',
          'Roboto',
          'sans-serif',
        ].join(','),
        fontWeight: 700,
      },
      h4: {
        fontFamily: [
          'Chakra Petch',
          'Roboto',
          'sans-serif',
        ].join(','),
        fontWeight: 600,
      },
      h5: {
        fontFamily: [
          'Chakra Petch',
          'Roboto',
          'sans-serif',
        ].join(','),
        fontWeight: 600,
      },
      h6: {
        fontFamily: [
          'Chakra Petch',
          'Roboto',
          'sans-serif',
        ].join(','),
        fontWeight: 600,
      },
    },

    // ⭐ Add this block
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#c56aaa",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            "&.Mui-focused": {
              color: "#c56aaa",
            },
          },
        },
      },
    },
  });


  return (
    <StyledJsxRegistry>
      <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
    </StyledJsxRegistry>
  );
}

export default ThemeProvider;

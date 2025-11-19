"use client";

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { useMemo, PropsWithChildren } from "react";
import StyledJsxRegistry from "./registry";

function ThemeProvider(props: PropsWithChildren) {
  const theme = useMemo(
    () =>
      createTheme({
        cssVariables: {
          colorSchemeSelector: "class",
        },
        colorSchemes: {
          light: {
            palette: {
              primary: {
                main: "#6189f5ff",
              },
              grey: {
                200: "#f5f5f5",
              },
            },
          },
          dark: {
            palette: {
              primary: {
                main: "#338cffff",
              },
              grey: {
                200: "#424242",
              },
            },
          },
        },
      }),
    []
  );

  return (
    <StyledJsxRegistry>
      <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
    </StyledJsxRegistry>
  );
}

export default ThemeProvider;

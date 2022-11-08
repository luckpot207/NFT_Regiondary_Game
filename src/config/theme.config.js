import { createTheme } from "@mui/material/styles";

export const themeConfig = createTheme({
  typography: {
    fontFamily: "Montserrat Alternates, sans-serif, cursive",
    fontSize: 13,
  },
  components: {},
  palette: {
    primary: {
      main: "#2da6f7",
    },
    mode: "dark",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1300,
      xl: 1536,
    },
  },
});

import { Button, ButtonProps } from "@mui/material";
import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton";

import { styled } from "@mui/material/styles";

const FireBtn = styled(LoadingButton)<LoadingButtonProps>(({}) => ({
  fontWeight: "bold",
  color: "white",
  textShadow:
    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
  background:
    "linear-gradient(360deg, #024699, #ffffff29),radial-gradient(#5bfdff, #358dcd)",
  transition: ".4s all",
  "&:hover": {
    background:
      "linear-gradient(360deg, #052c5c, #ffffff29),radial-gradient(#40b9bb, #286d9f)",
    transition: ".4s all",
  },
  "&[disabled]": {
    background: "#333",
    transition: ".4s all",
    cursor: "default",
    color: "gray",
  },
}));

export default FireBtn;

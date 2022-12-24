import { Button, ButtonProps } from "@mui/material";
import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton";

import { styled } from "@mui/material/styles";

const GreyFireBtn = styled(LoadingButton)<LoadingButtonProps>(({}) => ({
  fontWeight: "bold",
  color: "white",
  textShadow:
    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
  background:
    "linear-gradient(360deg, #343434, #ffffff29), radial-gradient(#343434, #ffffff)",
  transition: ".4s all",
  "&:hover": {
    background:
      "linear-gradient(360deg, #174f95, #ffffff29),radial-gradient(#12273c, #75a3c5)",
    transition: ".4s all",
  },
  "&[disabled]": {
    background: "#333",
    transition: ".4s all",
    cursor: "default",
    color: "gray",
  },
}));

export default GreyFireBtn;

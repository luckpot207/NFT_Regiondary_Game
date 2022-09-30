import { Button, ButtonProps } from "@mui/material";
import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton";

import { styled } from "@mui/material/styles";

const FireBtn = styled(LoadingButton)<LoadingButtonProps>(({}) => ({
  fontWeight: "bold",
  color: "white",
  textShadow:
    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
  background:
    "linear-gradient(360deg, #973b04, #ffffff29), radial-gradient(#db5300, #ecff0e)",
  transition: ".4s all",
  "&:hover": {
    background:
      "linear-gradient(360deg, #8d4405, #ffffff29), radial-gradient(#702c02, #98a500)",
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

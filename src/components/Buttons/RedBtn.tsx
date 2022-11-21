import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton";

import { styled } from "@mui/material/styles";

const RedBtn = styled(LoadingButton)<LoadingButtonProps>(({}) => ({
  fontWeight: "bold",
  color: "white",
  textShadow:
    "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
  background:
    "linear-gradient(360deg, #b31919, #ffffff29),radial-gradient(#812727, #ff9797)",
  transition: ".4s all",
  "&:hover": {
    background:
      "linear-gradient(360deg, #951717, #ffffff29),radial-gradient(#3c1212, #c57575)",
    transition: ".4s all",
  },
  "&[disabled]": {
    background: "#333",
    transition: ".4s all",
    cursor: "default",
    color: "gray",
  },
}));

export default RedBtn;

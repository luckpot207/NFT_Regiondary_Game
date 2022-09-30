import { MenuItem } from "@mui/material";
import { withStyles, createStyles } from "@mui/styles";

const styles = () =>
  createStyles({
    root: {
      backgroundColor: "#7c3c00 !important",
      "&$selected": {
        backgroundColor: "#9c5c00 !important",
        "&:hover": {
          backgroundColor: "#ae6c00 !important",
        },
      },
      "&:hover": {
        backgroundColor: "#8c3c00 !important",
      },
    },
    selected: {},
  });

export default withStyles(styles)(MenuItem);

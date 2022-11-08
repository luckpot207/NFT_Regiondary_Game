import { MenuItem } from "@mui/material";
import { withStyles, createStyles } from "@mui/styles";

const styles = () =>
  createStyles({
    root: {
      backgroundColor: "#168601 !important",
      "&$selected": {
        backgroundColor: "#18a601 !important",
        "&:hover": {
          backgroundColor: "#18e001 !important",
        },
      },
      "&:hover": {
        backgroundColor: "#189601 !important",
      },
    },
    selected: {},
  });

export default withStyles(styles)(MenuItem);

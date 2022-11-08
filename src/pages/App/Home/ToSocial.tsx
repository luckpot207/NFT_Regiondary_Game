import React from "react";
import RectBtn from "../../../components/Buttons/RectBtn";
import Constants from "../../../constants";
import { Grid } from "@mui/material";

const ToSocial: React.FC = () => {
  return (
    <Grid
      container
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {Constants.navlink.toSocial.map((item, index) => (
        <RectBtn key={index} type={item.type} link={item.link} />
      ))}
    </Grid>
  );
};

export default ToSocial;

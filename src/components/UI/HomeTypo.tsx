import { Typography, Box } from "@mui/material";
import React from "react";

type Props = {
  title: any;
  info: string | number | Number | any;
};

const HomeTypo: React.FC<Props> = ({ title, info }) => {
  return (
    <Typography variant="subtitle1" className="fc1" sx={{ fontWeight: "bold" }}>
      <span>{title}</span>
      <span className="fc2" style={{ marginLeft: 4 }}>
        {info}
      </span>
    </Typography>
  );
};

export default HomeTypo;

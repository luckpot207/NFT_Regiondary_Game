import { Card, Typography } from "@mui/material";
import React from "react";

const TipsAndTricks: React.FC = () => {
  return (
    <Card
      className="bg-c4"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 4,
      }}
    >
      <Typography variant="h3" fontWeight={"bold"}>
        Coming Soon
      </Typography>
    </Card>
  );
};

export default TipsAndTricks;

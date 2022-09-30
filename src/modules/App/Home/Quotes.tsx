import React from "react";
import { Box, Typography } from "@mui/material";
import Sparkles from "../../../components/UI/Sparkles";
import Quotes from "../../../constants/quotes";

const QuotesPart: React.FC = () => {
  // Constant
  const quoteIndex =
    (Math.floor(new Date().getTime() / 1000 / 3600 / 24) - 53) % Quotes.length;
  return (
    <Box
      sx={{
        p: 2,
        textAlign: "center",
        px: 10,
      }}
    >
      <Sparkles minDelay={6000} maxDelay={10000}>
        <Typography
          className="fc1"
          sx={{
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {Quotes[quoteIndex]}
        </Typography>
      </Sparkles>
    </Box>
  );
};

export default QuotesPart;

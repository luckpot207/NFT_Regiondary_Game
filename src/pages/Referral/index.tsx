import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";

import { Box, Typography } from "@mui/material";
import HandshakeIcon from "@mui/icons-material/Handshake";

import FireBtn from "../../components/Buttons/FireBtn";
import { useReferralSystem, useWeb3 } from "../../web3hooks/useContract";
import { refer } from "../../web3hooks/contractFunctions/referral.contract";
import { navLinks } from "../../config/nav.config";

const ReferralPage: React.FC = () => {
  const { address } = useParams();
  const [isReferring, setIsReferring] = useState(false);
  const web3 = useWeb3();
  const { account } = useWeb3React();
  const isValid = web3.utils.isAddress(address || "");
  const referralSystemContract = useReferralSystem();
  const navigate = useNavigate();

  const handleClickRefer = async () => {
    setIsReferring(true);
    try {
      console.log(referralSystemContract, account);
      await refer(referralSystemContract, account, address);
      navigate(navLinks.home, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Affiliate Failed");
    }
    setIsReferring(false);
  };

  useEffect(() => {
    if (!isValid) {
      navigate(navLinks.home, { replace: true });
    }
  });

  return (
    <Box id="main" sx={{ height: "100vh !important", position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          width: "100%",
          transform: "translateY(-50%)",
          textAlign: "center",
        }}
      >
        <Typography
          color="primary"
          sx={{
            fontSize: { lg: "60px", md: "40px", xs: "30px" },
            fontWeight: "800",
          }}
        >
          WELCOME TO BIG CRYPTO GAME
        </Typography>
        <Box
          sx={{
            margin: "auto",
            marginTop: "30px",
            maxWidth: { xl: "35%", lg: "40%", sm: "500px" },
            width: "calc(100% - 20px)",
            minHeight: "300px",
            border: "5px solid #e89f38",
            background: "#1e1e1e",
            borderRadius: "15px",
            boxShadow: "3px 5px 3px rgb(255 255 255 / 22%)",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <HandshakeIcon
            sx={{
              fontSize: "80px",
              marginTop: "10px",
              marginBottom: "10px",
              color: "yellow",
            }}
          />
          <Typography
            sx={{ fontSize: { xl: "25px", sm: "20px" } }}
            marginBottom={1}
          >
            You have been referred by this wallet address:{" "}
          </Typography>
          <Typography
            sx={{
              fontSize: { xl: "25px", sm: "20px" },
              wordBreak: "break-all",
            }}
            marginBottom={2}
          >
            {address}
          </Typography>
          <Typography
            sx={{ fontSize: { xl: "25px", sm: "20px" } }}
            marginBottom={2}
          >
            If you accept this invitation, and if you summon 20 (or more)
            warriors today, then you will receive a gift voucher for 1 free
            summon.
          </Typography>
          <FireBtn
            sx={{
              mb: 1,
              width: "100%",
              wordBreak: "break-word",
              fontSize: 14,
            }}
            loading={isReferring}
            onClick={handleClickRefer}
          >
            <img
              src={`/assets/images/dashboard/legion.png`}
              style={{
                width: "18px",
                height: "18px",
                marginRight: "5px",
              }}
              alt="icon"
            />
            Confirm and Start Playing
          </FireBtn>
        </Box>
      </Box>
    </Box>
  );
};

export default ReferralPage;

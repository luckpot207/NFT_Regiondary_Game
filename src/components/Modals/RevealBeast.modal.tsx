import { Box, Dialog, DialogContent } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useDispatch } from "react-redux";
import { revealBeast } from "../../helpers/beast";
import { gameState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";
import { useBeast } from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import LanguageTranslate from "../UI/LanguageTranslate";

const RevealBeastModal: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const {
    language,
    mintBeastPending,
    revealBeastLoading,
    mintBeastVRFPending,
  } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();

  // Contracts
  const beastContract = useBeast();

  // Functions
  const handleRevealBeast = () => {
    revealBeast(dispatch, account, beastContract);
  };

  return (
    <Dialog open={mintBeastPending && !revealBeastLoading}>
      <DialogContent>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <FireBtn
            sx={{ fontWeight: "bold" }}
            onClick={() => handleRevealBeast()}
            loading={mintBeastVRFPending.valueOf()}
          >
            <LanguageTranslate translateKey="revealBeasts" />
          </FireBtn>
        </Box>
        <img style={{ width: "100%" }} src={"/assets/images/reveal.gif"} />
      </DialogContent>
    </Dialog>
  );
};

export default RevealBeastModal;

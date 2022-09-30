import { Box, Dialog, DialogContent } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { useDispatch } from "react-redux";
import { revealWarrior } from "../../helpers/warrior";
import { gameState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";
import { useBeast, useWarrior } from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import LanguageTranslate from "../UI/LanguageTranslate";

const RevealWarriorModal: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const {
    language,
    mintWarriorPending,
    revealWarriorLoading,
    mintWarriorVRFPending,
  } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();

  // Contracts
  const warriorContract = useWarrior();

  // Functions
  const handleRevealWarrior = () => {
    revealWarrior(dispatch, account, warriorContract);
  };

  return (
    <Dialog open={mintWarriorPending && !revealWarriorLoading}>
      <DialogContent>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <FireBtn
            sx={{ fontWeight: "bold" }}
            onClick={() => handleRevealWarrior()}
            loading={mintWarriorVRFPending.valueOf()}
          >
            <LanguageTranslate translateKey="revealWarriors" />
          </FireBtn>
        </Box>
        <img style={{ width: "100%" }} src={"/assets/images/reveal.gif"} />
      </DialogContent>
    </Dialog>
  );
};

export default RevealWarriorModal;

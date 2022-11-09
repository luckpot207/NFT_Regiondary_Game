import React from "react";
import { Box, Dialog, DialogContent } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";
import { useWarrior } from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import { warriorState } from "../../reducers/warrior.reducer";
import WarriorService from "../../services/warrior.service";

const RevealWarriorModal: React.FC = () => {
  const dispatch = useDispatch();
  const { mintWarriorPending, revealWarriorLoading, mintWarriorVRFPending } =
    AppSelector(warriorState);

  const { account } = useWeb3React();

  const warriorContract = useWarrior();

  const handleRevealWarrior = () => {
    WarriorService.revealWarrior(dispatch, account, warriorContract);
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
            {getTranslation("revealWarriors")}
          </FireBtn>
        </Box>
        <img style={{ width: "100%" }} src={"/assets/images/reveal.gif"} />
      </DialogContent>
    </Dialog>
  );
};

export default RevealWarriorModal;

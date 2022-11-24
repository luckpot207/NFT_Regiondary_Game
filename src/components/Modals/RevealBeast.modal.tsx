import React from "react";
import { Box, Dialog, DialogContent } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { beastState } from "../../reducers/beast.reducer";
import BeastService from "../../services/beast.service";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";
import { useBeast } from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import constants from "../../constants";
import VideoNFT from "../UI/VideoNFT";

const RevealBeastModal: React.FC = () => {
  const dispatch = useDispatch();

  const { mintBeastPending, revealBeastLoading, mintBeastVRFPending } =
    AppSelector(beastState);

  const { account } = useWeb3React();

  const beastContract = useBeast();

  const handleRevealBeast = () => {
    BeastService.revealBeast(dispatch, account, beastContract);
  };

  return (
    <Dialog
      open={mintBeastPending && !revealBeastLoading}
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
        },
      }}
    >
      <DialogContent>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <FireBtn
            sx={{ fontWeight: "bold" }}
            onClick={() => handleRevealBeast()}
            loading={mintBeastVRFPending.valueOf()}
          >
            {getTranslation("revealBeasts")}
          </FireBtn>
        </Box>
        <VideoNFT src="/assets/images/reveal.mp4" />
      </DialogContent>
    </Dialog>
  );
};

export default RevealBeastModal;

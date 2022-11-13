import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";
import {
  useBeast,
  useFeeHandler,
  useLegion,
  useMarketplace,
  useWarrior,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import {
  marketplaceState,
  updateMarketplaceState,
} from "../../reducers/marketplace.reducer";
import { getUSDAmount } from "../../web3hooks/contractFunctions/feehandler.contract";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { updatePrice } from "../../web3hooks/contractFunctions/marketplace.contract";
import MarketplaceService from "../../services/marketplace.service";
import gameConfig from "../../config/game.config";
import constants from "../../constants";

const UpdatePriceModal: React.FC = () => {
  const dispatch = useDispatch();
  const {
    updatePriceLoading,
    listingPrice,
    listingId,
    listingType,
    listingAttackPower,
  } = AppSelector(marketplaceState);
  const { updatePriceModalOpen } = AppSelector(modalState);

  const { account } = useWeb3React();
  const web3 = useWeb3();

  const feehandlerContract = useFeeHandler();
  const marketplaceContract = useMarketplace();
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();

  const [equalBUSD, setEqualBUSD] = useState(0);

  // Use Effect
  useEffect(() => {
    getUSDAmountFunc();
  }, [listingPrice, account]);

  const getUSDAmountFunc = async () => {
    console.log(listingPrice);
    try {
      const usd = await getUSDAmount(web3, feehandlerContract, listingPrice);
      setEqualBUSD(usd);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    dispatch(updateModalState({ updatePriceModalOpen: false }));
  };

  const handlePrice = async (e: any) => {
    let price = e.target.value;
    if (price >= 1) {
      if (price[0] == "0") {
        price = price.slice(1);
      }
    } else if (price >= 0) {
      if (price == "") {
        price = "0";
      }
    } else {
      price = "0";
    }
    console.log(price);
    dispatch(updateMarketplaceState({ listingPrice: price }));
  };

  const handleUpdatePriceFunc = async () => {
    dispatch(
      updateModalState({
        updatePriceModalOpen: false,
      })
    );
    dispatch(
      updateMarketplaceState({
        updatePriceLoading: true,
      })
    );
    try {
      await updatePrice(
        web3,
        marketplaceContract,
        account,
        listingType,
        listingId,
        listingPrice
      );
      dispatch(updateMarketplaceState({ updatePriceLoading: false }));
      if (listingType === gameConfig.nftItemType.beast) {
        MarketplaceService.getAllBeastMarketItemsAct(
          dispatch,
          web3,
          beastContract,
          marketplaceContract
        );
      }
      if (listingType === gameConfig.nftItemType.warrior) {
        MarketplaceService.getAllWarriorMarketItemsAct(
          dispatch,
          web3,
          warriorContract,
          marketplaceContract
        );
      }
      if (listingType === gameConfig.nftItemType.legion) {
        MarketplaceService.getAllLegionsMarketItemsAct(
          dispatch,
          web3,
          legionContract,
          marketplaceContract
        );
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(updateMarketplaceState({ updatePriceLoading: false }));
  };

  return (
    <Dialog
      onClose={handleClose}
      open={updatePriceModalOpen.valueOf()}
      PaperProps={{
        style: {
          backgroundColor: constants.color.popupBGColor,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ p: 1, visibility: "hidden" }}>
          <FaTimes />
        </Box>
        <DialogTitle sx={{ textAlign: "center" }}>
          {getTranslation("updatePrice")}
        </DialogTitle>
        <Box sx={{ p: 1, cursor: "pointer" }} onClick={handleClose}>
          <FaTimes />
        </Box>
      </Box>
      <DialogContent>
        <TextField
          autoFocus
          variant="standard"
          label={`${getTranslation("priceIn")} ${getTranslation(
            "$"
          )}${getTranslation("blst")}`}
          margin="dense"
          id="listingprice"
          value={listingPrice}
          type="number"
          fullWidth
          onKeyDown={(evt) => {
            (evt.key === "e" ||
              evt.key === "E" ||
              evt.key === "+" ||
              evt.key === "-") &&
              evt.preventDefault();
          }}
          color={listingPrice < gameConfig.maxSellPrice ? "primary" : "error"}
          inputProps={{ step: "0.1" }}
          sx={{
            input: {
              color:
                listingPrice < gameConfig.maxSellPrice ? "white" : "#f44336",
            },
          }}
          onChange={handlePrice}
        />
        <Typography variant="subtitle1">
          (= {Number(equalBUSD).toFixed(2)} USD)
        </Typography>
      </DialogContent>
      {+listingPrice >= 0 && listingPrice < gameConfig.maxSellPrice ? (
        <FireBtn
          sx={{ fontWeight: "bold" }}
          onClick={handleUpdatePriceFunc}
          disabled={
            listingType === 3 && Number(listingAttackPower) / 100 > equalBUSD
          }
        >
          {listingType === 3 && Number(listingAttackPower) / 100 > equalBUSD
            ? getTranslation("sellWarning")
            : getTranslation("confirm")}
        </FireBtn>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            padding: 2,
            color: "#f44336",
            wordBreak: "break-word",
          }}
        >
          {getTranslation("maxSellPrice")}
        </Box>
      )}
    </Dialog>
  );
};

export default UpdatePriceModal;

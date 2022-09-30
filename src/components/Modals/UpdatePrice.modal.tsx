import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Constants from "../../constants";
import {
  getAllBeastMarketItemsAct,
  getAllLegionsMarketItemsAct,
  getAllWarriorMarketItemsAct,
} from "../../helpers/marketplace";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import { getTranslation } from "../../utils/utils";
import { getUSDAmount, updatePrice } from "../../web3hooks/contractFunctions";
import {
  useBeast,
  useFeeHandler,
  useLegion,
  useMarketplace,
  useWarrior,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import LanguageTranslate from "../UI/LanguageTranslate";

const UpdatePriceModal: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const { language, updatePriceModal, listingPrice, listingId, listingType } =
    AppSelector(gameState);

  // Account and Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const feehandlerContract = useFeeHandler();
  const marketplaceContract = useMarketplace();
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();

  // State
  const [equalBUSD, setEqualBUSD] = useState(0);

  // Functions
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
    dispatch(updateState({ updatePriceModal: false }));
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
    dispatch(updateState({ listingPrice: price }));
  };

  const handleUpdatePriceFunc = async () => {
    dispatch(
      updateState({
        updatePriceModal: false,
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
      dispatch(updateState({ updatePriceLoading: false }));
      if (listingType === Constants.nftItemType.beast) {
        getAllBeastMarketItemsAct(
          dispatch,
          web3,
          beastContract,
          marketplaceContract
        );
      }
      if (listingType === Constants.nftItemType.warrior) {
        getAllWarriorMarketItemsAct(
          dispatch,
          web3,
          warriorContract,
          marketplaceContract
        );
      }
      if (listingType === Constants.nftItemType.legion) {
        getAllLegionsMarketItemsAct(
          dispatch,
          web3,
          legionContract,
          marketplaceContract
        );
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(updateState({ updatePriceLoading: false }));
  };

  // Use Effect
  useEffect(() => {
    getUSDAmountFunc();
  }, [listingPrice]);

  return (
    <Dialog onClose={handleClose} open={updatePriceModal.valueOf()}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ p: 1, visibility: "hidden" }}>
          <FaTimes />
        </Box>
        <DialogTitle sx={{ textAlign: "center" }}>
          <LanguageTranslate translateKey="updatePrice" />
        </DialogTitle>
        <Box sx={{ p: 1, cursor: "pointer" }} onClick={handleClose}>
          <FaTimes />
        </Box>
      </Box>
      <DialogContent>
        <TextField
          autoFocus
          variant="standard"
          label={
            <>
              <LanguageTranslate translateKey="priceIn" />{" "}
              <LanguageTranslate translateKey="$" />
              <LanguageTranslate translateKey="blst" />
            </>
          }
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
          color={listingPrice < Constants.maxSellPrice ? "primary" : "error"}
          inputProps={{ step: "0.1" }}
          sx={{
            input: {
              color:
                listingPrice < Constants.maxSellPrice ? "white" : "#f44336",
            },
          }}
          onChange={handlePrice}
        />
        <Typography variant="subtitle1">
          (= {Number(equalBUSD).toFixed(2)} USD)
        </Typography>
      </DialogContent>
      {+listingPrice >= 0 && listingPrice < Constants.maxSellPrice ? (
        <FireBtn sx={{ fontWeight: "bold" }} onClick={handleUpdatePriceFunc}>
          <LanguageTranslate translateKey="confirm" />
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
          <LanguageTranslate translateKey="maxSellPrice" />
        </Box>
      )}
    </Dialog>
  );
};

export default UpdatePriceModal;

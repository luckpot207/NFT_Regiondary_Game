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
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import { AppSelector } from "../../store";
import {
  getUSDAmount,
  sellToken,
  isApprovedForAll,
  setApprovalForAll,
} from "../../web3hooks/contractFunctions";
import {
  useBeast,
  useFeeHandler,
  useLegion,
  useMarketplace,
  useWarrior,
  useWeb3,
} from "../../web3hooks/useContract";
import FireBtn from "../Buttons/FireBtn";
import { getMarketplaceAddress } from "../../web3hooks/getAddress";
import { getAllBeastsAct } from "../../helpers/beast";
import { getAllWarriorsAct } from "../../helpers/warrior";
import { getAllLegionsAct } from "../../helpers/legion";
import LanguageTranslate from "../UI/LanguageTranslate";

const ListOnMarketplaceModal: React.FC = () => {
  // Hook Info
  const dispatch = useDispatch();
  const {
    language,
    listOnMarketplaceModal,
    listingPrice,
    listingType,
    listingId,
    marketplaceTax,
  } = AppSelector(gameState);

  // Account & Web3
  const { account } = useWeb3React();
  const web3 = useWeb3();

  // Contracts
  const feehandlerContract = useFeeHandler();
  const marketplaceContract = useMarketplace();
  const beastContract = useBeast();
  const warriorContract = useWarrior();
  const legionContract = useLegion();

  // States
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
    dispatch(updateState({ listOnMarketplaceModal: false }));
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

  const checkApprovalForAll = async () => {
    let contract;
    if (listingType === 1) {
      contract = beastContract;
    }
    if (listingType === 2) {
      contract = warriorContract;
    }
    if (listingType === 3) {
      contract = legionContract;
    }
    if (
      (await isApprovedForAll(contract, account, getMarketplaceAddress())) ===
      false
    ) {
      await setApprovalForAll(account, contract, getMarketplaceAddress(), true);
    }
  };

  const handleSendToMarketplace = async () => {
    dispatch(
      updateState({ listOnMarketplaceModal: false, listingLoading: true })
    );
    try {
      await checkApprovalForAll();
      await sellToken(
        web3,
        marketplaceContract,
        account,
        listingType,
        listingId,
        listingPrice
      );
      if (listingType === 1) {
        getAllBeastsAct(dispatch, account, beastContract);
      }
      if (listingType === 2) {
        getAllWarriorsAct(dispatch, account, warriorContract);
      }
      if (listingType === 3) {
        getAllLegionsAct(dispatch, account, legionContract);
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(updateState({ listingLoading: false }));
  };

  // Use Effect
  useEffect(() => {
    getUSDAmountFunc();
  }, [listingPrice]);

  return (
    <Dialog onClose={handleClose} open={listOnMarketplaceModal.valueOf()}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ p: 1, visibility: "hidden" }}>
          <FaTimes />
        </Box>
        <DialogTitle sx={{ textAlign: "center" }}>
          <LanguageTranslate translateKey="listOnMarketplace" />
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
        <Typography variant="subtitle1">
          <LanguageTranslate translateKey="payMarketplaceTax" />{" "}
          {marketplaceTax}%
        </Typography>
      </DialogContent>
      {+listingPrice >= 0 && listingPrice < Constants.maxSellPrice ? (
        <FireBtn sx={{ fontWeight: "bold" }} onClick={handleSendToMarketplace}>
          <LanguageTranslate translateKey="sell" />
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

export default ListOnMarketplaceModal;

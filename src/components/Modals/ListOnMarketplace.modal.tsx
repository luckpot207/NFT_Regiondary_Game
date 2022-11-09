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
import { AppSelector } from "../../store";
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
import { legionState } from "../../reducers/legion.reducer";
import {
  marketplaceState,
  updateMarketplaceState,
} from "../../reducers/marketplace.reducer";
import { commonState, updateCommonState } from "../../reducers/common.reduer";
import { modalState, updateModalState } from "../../reducers/modal.reducer";
import { ILegion } from "../../types";
import { getUSDAmount } from "../../web3hooks/contractFunctions/feehandler.contract";
import {
  isApprovedForAll,
  setApprovalForAll,
} from "../../web3hooks/contractFunctions/common.contract";
import { sellToken } from "../../web3hooks/contractFunctions/marketplace.contract";
import { getTranslation } from "../../utils/utils";
import gameConfig from "../../config/game.config";

const ListOnMarketplaceModal: React.FC = () => {
  const dispatch = useDispatch();
  const { marketplaceTax } = AppSelector(commonState);
  const { allLegions } = AppSelector(legionState);
  const { listingPrice, listingType, listingId } =
    AppSelector(marketplaceState);
  const { listOnMarketplaceModalOpen } = AppSelector(modalState);

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

  let legion;
  if (listingType === 3) {
    legion = allLegions.find((legion: ILegion) => legion.id === listingId);
  }

  // Use Effect
  useEffect(() => {
    getUSDAmountFunc();
  }, [listingPrice]);

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
    dispatch(updateModalState({ listOnMarketplaceModalOpen: false }));
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
    dispatch(updateModalState({ listOnMarketplaceModalOpen: false }));
    dispatch(updateMarketplaceState({ listingLoading: true }));
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
      dispatch(updateCommonState({ reloadStatusTime: new Date().getTime() }));
    } catch (error) {
      console.log(error);
    }
    dispatch(updateMarketplaceState({ listingLoading: false }));
  };

  return (
    <Dialog onClose={handleClose} open={listOnMarketplaceModalOpen}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ p: 1, visibility: "hidden" }}>
          <FaTimes />
        </Box>
        <DialogTitle sx={{ textAlign: "center" }}>
          {getTranslation("listOnMarketplace")}
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
        <Typography variant="subtitle1">
          {getTranslation("payMarketplaceTax", {
            "#": marketplaceTax,
          })}
        </Typography>
      </DialogContent>
      {+listingPrice >= 0 && listingPrice < gameConfig.maxSellPrice ? (
        <FireBtn
          sx={{ fontWeight: "bold" }}
          onClick={handleSendToMarketplace}
          disabled={
            listingType === 3 && Number(legion?.attackPower) / 100 > equalBUSD
          }
        >
          {listingType === 3 && Number(legion?.attackPower) / 100 > equalBUSD
            ? getTranslation("sellWarning")
            : getTranslation("sell")}
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

export default ListOnMarketplaceModal;

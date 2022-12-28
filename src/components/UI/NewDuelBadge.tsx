import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { makeStyles } from "@mui/styles";

import DuelService from "../../services/duel.service";
import { useDuelSystem } from "../../web3hooks/useContract";
import constants from "../../constants";

const borderColorOfBadge = "gold";

const useStyles = makeStyles(() => ({
  NewBadge: {
    animation: `$bling linear 3s infinite`,
  },
  "@keyframes bling": {
    "0%": {
      filter: `drop-shadow(1px 1px 0 ${borderColorOfBadge}) drop-shadow(-1px -1px 0 ${borderColorOfBadge}) drop-shadow(-1px 1px 0 ${borderColorOfBadge}) drop-shadow(1px -1px 0 ${borderColorOfBadge})`,
    },
    "50%": {
      filter: `drop-shadow(1px 1px 2px ${borderColorOfBadge}) drop-shadow(-1px -1px 2px ${borderColorOfBadge}) drop-shadow(-1px 1px 2px ${borderColorOfBadge}) drop-shadow(1px -1px 2px ${borderColorOfBadge})`,
    },
    "100%": {
      filter: `drop-shadow(1px 1px 0 ${borderColorOfBadge}) drop-shadow(-1px -1px 0 ${borderColorOfBadge}) drop-shadow(-1px 1px 0 ${borderColorOfBadge}) drop-shadow(1px -1px 0 ${borderColorOfBadge})`,
    },
  },
}));

const NewDuelBadge: React.FC = () => {
  const { account } = useWeb3React();
  const duelContract = useDuelSystem();

  const classes = useStyles();

  const [isShow, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    checkNewStatus();
  }, []);

  const checkNewStatus = async () => {
    const isShow = await DuelService.checkAvailableOthersDuel(duelContract);
    console.log("new badge", isShow);
    setIsShow(isShow);
  };

  return (
    <>
      {isShow && (
        <img
          src="/assets/images/badge.png"
          className={classes.NewBadge}
          height={22}
          alt="New Item"
        />
      )}
    </>
  );
};

export default NewDuelBadge;

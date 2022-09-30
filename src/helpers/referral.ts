import { Contract } from "web3-eth-contract";

import { AppDispatch } from "../store";
import { updateState } from "../reducers/cryptolegions.reducer";
import {
  getComissions,
  getFreeMintInfo,
  getReferrals,
  getSummonWarriorsOnFirstDay,
} from "../web3hooks/contractFunctions";
import { IReferralStats } from "../interfaces";

export const getReferralLink = (address: string | undefined) => {
  const siteUrl = "https://play.cryptolegions.app";
  return `${siteUrl}/ref/${address}`;
};

export const getReferralInfo = async (
  dispatch: AppDispatch,
  web3: any,
  account: any,
  referralSystemContract: Contract,
  warriorNFTContract: Contract
) => {
  dispatch(updateState({ referralStatsLoading: true }));
  const referrals = await getReferrals(referralSystemContract, account);
  const comissions = await getComissions(referralSystemContract, account);
  const freeMintInfo = await getFreeMintInfo(warriorNFTContract, account);

  let layer1Comission = 0,
    layer2Comission = 0,
    layer1members: any = [],
    layer2members: any = [],
    layer1Count = 0,
    layer2Count = 0;

  comissions.forEach((comission: any) => {
    const { layer, usdAmount, from } = comission;
    if (Number(layer) === 1) {
      layer1Comission += Number(web3.utils.fromWei(usdAmount, "ether"));
      if (layer1members.find((item: any) => item === from)) {
      } else {
        layer1members.push(from);
      }
    } else if (Number(layer) === 2) {
      layer2Comission += Number(web3.utils.fromWei(usdAmount, "ether"));
      if (layer2members.find((item: any) => item === from)) {
      } else {
        layer2members.push(from);
      }
    }
  });

  const referralStats: IReferralStats = {
    referrals,
    layer1Comission,
    layer2Comission,
    layer1Count: layer1members.length,
    layer2Count: layer2members.length,
  };
  dispatch(
    updateState({
      referralStats,
      referralStatsLoading: false,
      hasFreeMint: freeMintInfo.hasFreeWarrior && !freeMintInfo.claimed,
    })
  );
};

export interface IInventory {
  BLSTBalance: Number;
  beastBalance: Number;
  warriorBalance: Number;
  legionBalance: Number;
  availableLegionsCount: Number;
  unclaimedUSD: Number;
  unclaimedBLST: Number;
  claimedUSD: Number;
  claimedBLST: Number;
  taxLeftDaysForClaim: Number;
  taxLeftDaysForReinvest: Number;
  maxAttackPower: Number;
  USDToBLST: Number;
  BLSTToUSD: Number;
  BUSDForTotalBLST: Number;
  claimedBUSDAlertAmount: Number;

  claimMinTaxPercent: Number;
  reinvestedWalletUSD: Number;
  reinvestedWalletBLST: Number;
  reinvestedTotalUSD: Number;
  additionalInvestment: Number;
  startupInvestment: Number;
  totalClaimedUSD: Number;

  currentReinvestPercent: Number;
  currentSamaritanStars: Number;
  currentTaxCycleStars: Number;

  futureReinvestPercentWhenClaim: Number;
  futureReinvestPercentWhenReinvest: Number;
  futureSamaritanStarsWhenClaim: Number;
  futureSamaritanStarsWhenReinvest: Number;
  remainUnclaimedUSDWhenClaim: Number;
  remainUnclaimedUSDWhenReinvest: Number;
  claimingUSDWithoutTax: Number;
  reinvestingUSDWithoutTax: Number;
  daysLeftUntilAbove3Stars: Number;

  voucherWalletUSD: Number;

  firstHuntTime: Number;
}

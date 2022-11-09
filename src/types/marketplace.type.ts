export interface IBeastMarket {
  id: String;
  type: String;
  capacity: Number;
  mp4: String;
  jpg: String;
  seller: String;
  price: Number;
  listingTime: Number;
  newItem: Boolean;
}

export interface IWarriorMarket {
  id: String;
  type: String;
  strength: Number;
  attackPower: Number;
  mp4: String;
  jpg: String;
  seller: String;
  price: Number;
  listingTime: Number;
  newItem: Boolean;
}

export interface ILegionMarket {
  id: String;
  name: String;
  beastIds: Number[];
  warriorIds: Number[];
  attackPower: Number;
  supplies: Number;
  huntStatus: Boolean;
  jpg: String;
  mp4: String;
  seller: String;
  price: Number;
  listingTime: Number;
  newItem: Boolean;
}
export interface IMarketplaceState {
  listingPrice: Number;
  listingType: Number;
  listingId: String;
  listingLoading: boolean;
  listingAttackPower: Number;

  allBeastsMarketItems: IBeastMarket[];
  getAllBeastsMarketItemsLoading: boolean;

  allWarriorsMarketItems: IWarriorMarket[];
  getAllWarriorsMarketItemsLoading: boolean;

  allLegionsMarketItems: ILegionMarket[];
  getAllLegionsMarketItemsLoading: boolean;

  updatePriceLoading: boolean;
  cancelItemLoading: boolean;
  buyItemLoading: boolean;
}

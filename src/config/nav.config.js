import Beasts from "../modules/App/Beasts";
import BeastsMarketplace from "../modules/App/Marketplace/Beasts";
import CreateLegion from "../modules/App/CreateLegion";
import Home from "../modules/App/Home";
import Hunt from "../modules/App/Hunt";
import Legions from "../modules/App/Legions";
import LegionsMarketplace from "../modules/App/Marketplace/Legions";
import UpdateLegion from "../modules/App/UpdateLegion";
import Warriors from "../modules/App/Warriors";
import WarriorsMarketplace from "../modules/App/Marketplace/Warriors";
import Help from "../modules/App/Help";
import HuntHistory from "../modules/App/HuntHistory";
import ReferralPage from "../modules/Referral";
import ReferPage from "../modules/App/ReferralPage";
import TipsAndTricks from "../modules/App/TipsAndTricks";
import Duel from "../modules/App/Duel";

export const navConfig = {
  drawerWidth: 250,
  routes: () => [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/beasts",
      element: <Beasts />,
    },
    {
      path: "/warriors",
      element: <Warriors />,
    },
    {
      path: "/legions",
      element: <Legions />,
    },
    {
      path: "/createlegions",
      element: <CreateLegion />,
    },
    {
      path: "/updateLegions/:id",
      element: <UpdateLegion />,
    },
    {
      path: "/hunt",
      element: <Hunt />,
    },
    {
      path: "/duel",
      element: <Duel />
    },
    {
      path: "/beastsMarketplace",
      element: <BeastsMarketplace />,
    },
    {
      path: "/warriorsMarketplace",
      element: <WarriorsMarketplace />,
    },
    {
      path: "/legionsMarketplace",
      element: <LegionsMarketplace />,
    },
    {
      path: "/help",
      element: <Help />,
    },
    {
      path: "/hunthistory",
      element: <HuntHistory />,
    },
    {
      path: "/referrals",
      element: <ReferPage />,
    },
    {
      path: "/tips",
      element: <TipsAndTricks />,
    },
  ],
  navBar: {
    left: [
      {
        type: "head",
        title: "play",
      },
      {
        type: "navlink",
        title: "warriors",
        icon: "warrior.png",
        path: "/warriors",
      },
      {
        type: "navlink",
        title: "beasts",
        icon: "beast.png",
        path: "/beasts",
      },
      {
        type: "navlink",
        title: "legions",
        icon: "legion.png",
        path: "/legions",
      },
      {
        type: "navlink",
        title: "hunt",
        icon: "hunt.png",
        path: "/hunt",
      },
      {
        type: "navlink",
        title: "duel",
        icon: "hunt.png",
        path: "/duel",
      },
      {
        type: "divider",
      },
      {
        type: "head",
        title: "market",
      },
      {
        type: "navlink",
        title: "warriors",
        icon: "marketWarrior.png",
        path: "/warriorsMarketplace",
      },
      {
        type: "navlink",
        title: "beasts",
        icon: "marketBeast.png",
        path: "/beastsMarketplace",
      },
      {
        type: "navlink",
        title: "legions",
        icon: "marketLegion.png",
        path: "/legionsMarketplace",
      },
      {
        type: "divider",
      },
      {
        type: "head",
        title: "usefulLinks",
      },
      {
        type: "link",
        title: "buyBlst",
        icon: "pancake.png",
        path: "https://pancakeswap.finance/swap?outputCurrency=0x10cb66ce2969d8c8193707A9dCD559D2243B8b37&inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      },
      {
        type: "navlink",
        title: "help",
        icon: "support.png",
        path: "/help",
      },
      {
        type: "divider",
      },
      {
        type: "head",
        title: "howToPlay",
      },
      {
        type: "tutorial",
        title: "help",
        icon: "tutorial.png",
      },
      {
        type: "link",
        title: "whitepaper",
        icon: "whitepaper.png",
        path: "https://docs.cryptolegions.app/",
        esPath: "https://docs-es.cryptolegions.app/",
      },
      {
        type: "navlink",
        title: "tips",
        icon: "tips.png",
        path: "/tips",
      },
      {
        type: "navlink",
        title: "referrals",
        icon: "support.png",
        path: "/referrals",
      },
      {
        type: "divider",
      },
      {
        type: "social",
        title: "discord",
        icon: "/assets/images/discord.png",
        path: "https://cryptolegions.app/d",
      },
      {
        type: "social",
        title: "telegram",
        icon: "/assets/images/telegram.png",
        path: "https://cryptolegions.app/t",
      },
      {
        type: "social",
        title: "twitter",
        icon: "/assets/images/twitter.png",
        path: "https://cryptolegions.app/tw",
      },
      {
        type: "social",
        title: "youtube",
        icon: "/assets/images/youtube.png",
        path: "https://cryptolegions.app/y",
      },
      {
        type: "social",
        title: "medium",
        icon: "/assets/images/medium.png",
        path: "https://cryptolegions.app/m",
      },
      {
        type: "privacy",
        title: "policy",
        icon: "policy",
        path: "/policy",
      },
      {
        type: "footer",
        title1: "madeWith",
        title2: "cryptoAgency",
      },
    ],
  },
};

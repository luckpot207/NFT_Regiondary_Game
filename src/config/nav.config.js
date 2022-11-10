import constants from "../constants";
import Beasts from "../pages/App/Beasts";
import CreateLegion from "../pages/App/CreateLegion";
import Home from "../pages/App/Home";
import Hunt from "../pages/App/Hunt";
import Legions from "../pages/App/Legions";
import BeastsMarketplace from "../pages/App/Marketplace/Beasts";
import LegionsMarketplace from "../pages/App/Marketplace/Legions";
import WarriorsMarketplace from "../pages/App/Marketplace/Warriors";
import UpdateLegion from "../pages/App/UpdateLegion";
import Warriors from "../pages/App/Warriors";
import Duel from "../pages/App/Duel";
import TipsAndTricks from "../pages/App/TipsAndTricks";
import ReferPage from "../pages/App/ReferralPage";
import Help from "../pages/App/Help";
import HuntHistory from "../pages/App/HuntHistory";

export const navConfig = {
  drawerWidth: 250,
  routes: () => [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/servers",
      element: <Beasts />,
    },
    {
      path: "/devs",
      element: <Warriors />,
    },
    {
      path: "/cybers",
      element: <Legions />,
    },
    {
      path: "/duels",
      element: <Duel />,
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
      path: "/devsMarketplace",
      element: <WarriorsMarketplace />,
    },
    {
      path: "/serversMarketplace",
      element: <BeastsMarketplace />,
    },
    {
      path: "/cybersMarketplace",
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
        path: "/devs",
      },
      {
        type: "navlink",
        title: "beasts",
        icon: "beast.png",
        path: "/servers",
      },
      {
        type: "navlink",
        title: "legions",
        icon: "legion.png",
        path: "/cybers",
      },
      {
        type: "navlink",
        title: "hunt",
        icon: "hunt.png",
        path: "/hunt",
      },
      {
        type: "navlink",
        title: "duels",
        icon: "legion.png",
        path: "/duels",
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
        path: "/devsMarketplace",
      },
      {
        type: "navlink",
        title: "beasts",
        icon: "marketBeast.png",
        path: "/serversMarketplace",
      },
      {
        type: "navlink",
        title: "legions",
        icon: "marketLegion.png",
        path: "/cybersMarketplace",
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
        path: constants.navlink.pancake,
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
        path: constants.navlink.whitepaper,
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
        path: constants.navlink.discord,
      },
      {
        type: "social",
        title: "telegram",
        icon: "/assets/images/telegram.png",
        path: constants.navlink.telegram,
      },
      {
        type: "social",
        title: "twitter",
        icon: "/assets/images/twitter.png",
        path: constants.navlink.twitter,
      },
      {
        type: "social",
        title: "youtube",
        icon: "/assets/images/youtube.png",
        path: constants.navlink.youtube,
      },
      {
        type: "social",
        title: "medium",
        icon: "/assets/images/medium.png",
        path: constants.navlink.medium,
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

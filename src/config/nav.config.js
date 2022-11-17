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

export const navLinks = {
  home: "/",
  beasts: "/servers",
  warriors: "/devs",
  legions: "/cybers",
  duel: "/duels",
  createlegion: "/createcyber",
  updatelegion: "/updatecyber",
  hunt: "/mine",
  warriorsmarketplace: "/devsmarketplace",
  beastsmarketplace: "/serversmarketplace",
  legionsmarketplace: "/cybersmarketplace",
  help: "/help",
  hunthistory: "/minehistory",
  referrals: "/referrals",
  tips: "/tips",
  policy: "/policy",
};

export const navConfig = {
  drawerWidth: 250,
  routes: () => [
    {
      path: navLinks.home,
      element: <Home />,
    },
    {
      path: navLinks.beasts,
      element: <Beasts />,
    },
    {
      path: navLinks.warriors,
      element: <Warriors />,
    },
    {
      path: navLinks.legions,
      element: <Legions />,
    },
    {
      path: navLinks.duel,
      element: <Duel />,
    },
    {
      path: navLinks.createlegion,
      element: <CreateLegion />,
    },
    {
      path: navLinks.updatelegion + "/:id",
      element: <UpdateLegion />,
    },
    {
      path: navLinks.hunt,
      element: <Hunt />,
    },
    {
      path: navLinks.warriorsmarketplace,
      element: <WarriorsMarketplace />,
    },
    {
      path: navLinks.beastsmarketplace,
      element: <BeastsMarketplace />,
    },
    {
      path: navLinks.legionsmarketplace,
      element: <LegionsMarketplace />,
    },
    {
      path: navLinks.help,
      element: <Help />,
    },
    {
      path: navLinks.hunthistory,
      element: <HuntHistory />,
    },
    {
      path: navLinks.referrals,
      element: <ReferPage />,
    },
    {
      path: navLinks.tips,
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
        path: navLinks.warriors,
      },
      {
        type: "navlink",
        title: "beasts",
        icon: "beast.png",
        path: navLinks.beasts,
      },
      {
        type: "navlink",
        title: "legions",
        icon: "legion.png",
        path: navLinks.legions,
      },
      {
        type: "navlink",
        title: "hunt",
        icon: "hunt.png",
        path: navLinks.hunt,
      },
      {
        type: "navlink",
        title: "duels",
        icon: "duels.png",
        path: navLinks.duel,
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
        path: navLinks.warriorsmarketplace,
      },
      {
        type: "navlink",
        title: "beasts",
        icon: "marketBeast.png",
        path: navLinks.beastsmarketplace,
      },
      {
        type: "navlink",
        title: "legions",
        icon: "marketLegion.png",
        path: navLinks.legionsmarketplace,
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
        path: navLinks.help,
      },
      {
        type: "divider",
      },
      {
        type: "head",
        title: "howToPlay",
      },
      // {
      //   type: "tutorial",
      //   title: "help",
      //   icon: "tutorial.png",
      // },
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
        path: navLinks.tips,
      },
      {
        type: "navlink",
        title: "referrals",
        icon: "refer.png",
        path: navLinks.referrals,
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
        path: navLinks.policy,
      },
      {
        type: "footer",
        title1: "madeWith",
        title2: "cryptoAgency",
      },
    ],
  },
};

import { translations } from "../constants/texts";

export const getTranslation = (lang, key, _param1, _param2) => {
  return _param1
    ? translations[key](_param1, _param2)[lang]
    : translations[key][lang];
};

export const showWallet = (start, end, account) => {
  return account === undefined || account === null
    ? "..."
    : account.substr(0, start) +
        "..." +
        account.substr(account.length - end, end);
};

export const formatNumber = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const toCapitalize = (x) => {
  return x[0].toUpperCase() + x.substr(1).toLowerCase();
};

export const getWarriorJpg = (x, y) => {
  let jpg = "";
  switch (x) {
    case 1:
      if (y >= 500 && y < 600) jpg = "1-90.jpg";
      else if (y >= 600 && y < 700) jpg = "1-95.jpg";
      else if (y >= 700 && y < 800) jpg = "1-100.jpg";
      else if (y >= 800 && y < 900) jpg = "1-105.jpg";
      else jpg = "1-110.jpg";
      break;
    case 2:
      if (y >= 1000 && y < 1200) jpg = "2-90.jpg";
      else if (y >= 1200 && y < 1400) jpg = "2-95.jpg";
      else if (y >= 1400 && y < 1600) jpg = "2-100.jpg";
      else if (y >= 1600 && y < 1800) jpg = "2-105.jpg";
      else jpg = "2-110.jpg";
      break;
    case 3:
      if (y >= 2000 && y < 2200) jpg = "3-90.jpg";
      else if (y >= 2200 && y < 2400) jpg = "3-95.jpg";
      else if (y >= 2400 && y < 2600) jpg = "3-100.jpg";
      else if (y >= 2600 && y < 2800) jpg = "3-105.jpg";
      else jpg = "3-110.jpg";
      break;
    case 4:
      if (y >= 3000 && y < 3200) jpg = "4-90.jpg";
      else if (y >= 3200 && y < 3400) jpg = "4-95.jpg";
      else if (y >= 3400 && y < 3600) jpg = "4-100.jpg";
      else if (y >= 3600 && y < 3800) jpg = "4-105.jpg";
      else jpg = "4-110.jpg";
      break;
    case 5:
      if (y >= 4000 && y < 4400) jpg = "5-90.jpg";
      else if (y >= 4400 && y < 4800) jpg = "5-95.jpg";
      else if (y >= 4800 && y < 5200) jpg = "5-100.jpg";
      else if (y >= 5200 && y < 5600) jpg = "5-105.jpg";
      else jpg = "5-110.jpg";
      break;
    case 6:
      if (y >= 50000 && y < 52000) jpg = "6-90.jpg";
      else if (y >= 52000 && y < 54000) jpg = "6-95.jpg";
      else if (y >= 54000 && y < 56000) jpg = "6-100.jpg";
      else if (y >= 56000 && y < 58000) jpg = "6-105.jpg";
      else jpg = "6-110.jpg";
    default:
      break;
  }
  return "/assets/images/characters/jpg/warriors/" + jpg;
};

export const getWarriorMp4 = (x, y) => {
  let mp4 = "";
  switch (x) {
    case 1:
      if (y >= 500 && y < 600) mp4 = "1-90.mp4";
      else if (y >= 600 && y < 700) mp4 = "1-95.mp4";
      else if (y >= 700 && y < 800) mp4 = "1-100.mp4";
      else if (y >= 800 && y < 900) mp4 = "1-105.mp4";
      else mp4 = "1-110.mp4";
      break;
    case 2:
      if (y >= 1000 && y < 1200) mp4 = "2-90.mp4";
      else if (y >= 1200 && y < 1400) mp4 = "2-95.mp4";
      else if (y >= 1400 && y < 1600) mp4 = "2-100.mp4";
      else if (y >= 1600 && y < 1800) mp4 = "2-105.mp4";
      else mp4 = "2-110.mp4";
      break;
    case 3:
      if (y >= 2000 && y < 2200) mp4 = "3-90.mp4";
      else if (y >= 2200 && y < 2400) mp4 = "3-95.mp4";
      else if (y >= 2400 && y < 2600) mp4 = "3-100.mp4";
      else if (y >= 2600 && y < 2800) mp4 = "3-105.mp4";
      else mp4 = "3-110.mp4";
      break;
    case 4:
      if (y >= 3000 && y < 3200) mp4 = "4-90.mp4";
      else if (y >= 3200 && y < 3400) mp4 = "4-95.mp4";
      else if (y >= 3400 && y < 3600) mp4 = "4-100.mp4";
      else if (y >= 3600 && y < 3800) mp4 = "4-105.mp4";
      else mp4 = "4-110.mp4";
      break;
    case 5:
      if (y >= 4000 && y < 4400) mp4 = "5-90.mp4";
      else if (y >= 4400 && y < 4800) mp4 = "5-95.mp4";
      else if (y >= 4800 && y < 5200) mp4 = "5-100.mp4";
      else if (y >= 5200 && y < 5600) mp4 = "5-105.mp4";
      else mp4 = "5-110.mp4";
      break;
    case 6:
      if (y >= 50000 && y < 52000) mp4 = "6-90.mp4";
      else if (y >= 52000 && y < 54000) mp4 = "6-95.mp4";
      else if (y >= 54000 && y < 56000) mp4 = "6-100.mp4";
      else if (y >= 56000 && y < 58000) mp4 = "6-105.mp4";
      else mp4 = "6-110.mp4";
    default:
      break;
  }
  return "/assets/images/characters/mp4/warriors/" + mp4;
};

export const getWarriorStrength = (ap) => {
  if (ap > 500 && ap <= 1000) {
    return 1;
  } else if (ap > 500 && ap <= 2000) {
    return 2;
  } else if (ap > 500 && ap <= 3000) {
    return 3;
  } else if (ap > 500 && ap <= 4000) {
    return 4;
  } else if (ap > 500 && ap <= 6000) {
    return 5;
  } else if (ap > 50000 && ap <= 60000) {
    return 6;
  }
  return 1;
};

export const getBeastJPG = (capacity) => {
  let variables = ["90", "95", "100", "105", "110"];
  let jpg = "";
  switch (capacity) {
    case 1:
      jpg = "1-" + variables[Math.floor(Math.random() * 5)] + ".jpg";
      break;
    case 2:
      jpg = "2-" + variables[Math.floor(Math.random() * 5)] + ".jpg";
      break;
    case 3:
      jpg = "3-" + variables[Math.floor(Math.random() * 5)] + ".jpg";
      break;
    case 4:
      jpg = "4-" + variables[Math.floor(Math.random() * 5)] + ".jpg";
      break;
    case 5:
      jpg = "5-" + variables[Math.floor(Math.random() * 5)] + ".jpg";
      break;
    case 20:
      jpg = "20-" + variables[Math.floor(Math.random() * 5)] + ".jpg";
      break;
    default:
      break;
  }
  return "/assets/images/characters/jpg/beasts/" + jpg;
};

export const getBeastMp4 = (x) => {
  let variables = ["90", "95", "100", "105", "110"];
  let mp4 = "";
  switch (x) {
    case 1:
      mp4 = "1-" + variables[Math.floor(Math.random() * 5)] + ".mp4";
      break;
    case 2:
      mp4 = "2-" + variables[Math.floor(Math.random() * 5)] + ".mp4";
      break;
    case 3:
      mp4 = "3-" + variables[Math.floor(Math.random() * 5)] + ".mp4";
      break;
    case 4:
      mp4 = "4-" + variables[Math.floor(Math.random() * 5)] + ".mp4";
      break;
    case 5:
      mp4 = "5-" + variables[Math.floor(Math.random() * 5)] + ".mp4";
      break;
    case 20:
      mp4 = "20-" + variables[Math.floor(Math.random() * 5)] + ".mp4";
      break;
    default:
      break;
  }
  return "/assets/images/characters/mp4/beasts/" + mp4;
};

export const getLegionJpgImageUrl = (ap) => {
  if (ap <= 150000) return "/assets/images/characters/jpg/legions/0.jpg";
  else if (ap > 150000 && ap <= 300000)
    return "/assets/images/characters/jpg/legions/15.jpg";
  else if (ap > 300000 && ap <= 450000)
    return "/assets/images/characters/jpg/legions/30.jpg";
  else if (ap > 450000 && ap <= 600000)
    return "/assets/images/characters/jpg/legions/45.jpg";
  else if (ap > 600000 && ap <= 2500000)
    return "/assets/images/characters/jpg/legions/60.jpg";
  else return "/assets/images/characters/jpg/legions/250.jpg";
};

export const getLegionMp4ImageUrl = (ap) => {
  if (ap <= 150000) return "/assets/images/characters/mp4/legions/0.mp4";
  else if (ap > 150000 && ap <= 300000)
    return "/assets/images/characters/mp4/legions/15.mp4";
  else if (ap > 300000 && ap <= 450000)
    return "/assets/images/characters/mp4/legions/30.mp4";
  else if (ap > 450000 && ap <= 600000)
    return "/assets/images/characters/mp4/legions/45.mp4";
  else if (ap > 600000 && ap <= 2500000)
    return "/assets/images/characters/mp4/legions/60.mp4";
  else return "/assets/images/characters/mp4/legions/250.mp4";
};

export const getMonsterJpgImage = (tokenId) => {
  return `/assets/images/characters/jpg/monsters/m${tokenId}.jpg`;
};

export const getMonsterGifImage = (tokenId) => {
  return `/assets/images/characters/gif/monsters/m${tokenId}.gif`;
};

export const getSamaritanStarsWithPercentAndFirstHuntTime = (
  reinvestPercent,
  firstHuntTime
) => {
  let stars = 0;
  if (reinvestPercent < 20) {
    stars = 0;
  } else if (reinvestPercent < 35) {
    stars = 1;
  } else if (reinvestPercent < 50) {
    stars = 2;
  } else if (reinvestPercent < 65) {
    stars = 3;
  } else if (reinvestPercent < 80) {
    stars = 4;
  } else {
    stars = 5;
  }
  if (
    stars > 3 &&
    // new Date().getTime() - firstHuntTime * 1000 < 3600 * 1000 * 24 * 30 // 30 Days
    new Date().getTime() - firstHuntTime * 1000 < 60 * 1000 * 30 // 30 Minutes
  ) {
    stars = 3;
  }
  return stars;
};

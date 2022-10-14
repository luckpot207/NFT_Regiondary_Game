import {
  Box,
  Button,
  Card,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  gameState,
  reloadContractStatus,
  updateState,
} from "../../reducers/cryptolegions.reducer";

import { AppSelector } from "../../store";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Tutorial from "../Tutorial/Tutorial";
import { getTranslation } from "../../utils/utils";
import { languages } from "../../constants/languages";
import { navConfig } from "../../config/nav.config";
import { useDispatch } from "react-redux";
import LanguageTranslate from "../UI/LanguageTranslate";

const NavList: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { tutorialOn, tutorialRestartStep, language } = AppSelector(gameState);

  const [anchorEl, setAnchorEl] = useState(null);
  const languageOpen = Boolean(anchorEl);

  const getTutorialStep = (title: string) => {
    let step = -1;
    switch (title) {
      case "/warriors":
        step = 1;
        break;
      case "/beasts":
        step = 7;
        break;
      case "/hunt":
        step = 17;
        break;
      case "whitepaper":
        step = 20;
        break;
      default:
        break;
    }
    return step;
  };

  const setTutorialOn = () => {
    if (
      location.pathname == "/warriors" ||
      location.pathname == "/beasts" ||
      location.pathname == "/createlegions" ||
      location.pathname == "/legions" ||
      location.pathname == "/hunt"
    ) {
      dispatch(
        updateState({
          tutorialOn: !tutorialOn,
          isSideBarOpen: false,
        })
      );
    } else {
      dispatch(
        updateState({
          tutorialOn: !tutorialOn,
          tutorialStep: [1],
          isSideBarOpen: true,
        })
      );
    }
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguage = (value: any) => {
    console.log(value);
    setAnchorEl(null);
    localStorage.setItem("lang", value);
    dispatch(
      updateState({
        language: value,
      })
    );
  };

  return (
    <Box>
      <Toolbar sx={{ display: { xs: "none", md: "flex" } }} />
      <Divider sx={{ display: { xs: "none", md: "block" } }} />
      <List
        sx={{
          pb: 8,
        }}
      >
        {navConfig.navBar.left.map((navItem, index) => (
          <React.Fragment key={"nav_item_" + index}>
            {navItem.type === "link" && (
              <Tutorial
                placement="bottom"
                curStep={getTutorialStep(navItem.title ? navItem.title : "")}
              >
                <a
                  target="_blank"
                  className="nav-bar-item"
                  href={
                    navItem.title === "whitepaper" && language === "es"
                      ? navItem.esPath
                      : navItem.path || ""
                  }
                >
                  <Tooltip title={navItem.title || ""} placement="right">
                    <ListItemButton>
                      <img
                        src={`/assets/images/${navItem.icon}`}
                        style={{
                          width: "22px",
                          height: "22px",
                          marginRight: "34px",
                        }}
                        alt="icon"
                      />
                      <ListItemText
                        primary={
                          <LanguageTranslate
                            translateKey={navItem.title as string}
                          />
                        }
                      />
                    </ListItemButton>
                  </Tooltip>
                </a>
              </Tutorial>
            )}
            {navItem.type === "navlink" && (
              <Tutorial
                placement="bottom"
                curStep={getTutorialStep(navItem.path ? navItem.path : "")}
              >
                <NavLink
                  to={navItem.path || ""}
                  className={({ isActive }) =>
                    "nav-bar-item " + (isActive ? "active" : "")
                  }
                  onClick={() =>
                    dispatch(updateState({ isSideBarOpen: false }))
                  }
                >
                  <Tooltip title={navItem.title || ""} placement="right">
                    <ListItemButton>
                      <img
                        src={`/assets/images/${navItem.icon}`}
                        style={{
                          width: "22px",
                          height: "22px",
                          marginRight: "34px",
                        }}
                        alt="icon"
                      />
                      <ListItemText
                        primary={
                          navItem.title == "duels"
                            ? "Duels"
                            : <LanguageTranslate
                              translateKey={navItem.title as string}
                            />
                        }
                      />
                    </ListItemButton>
                  </Tooltip>
                </NavLink>
              </Tutorial>
            )}
            {navItem.type === "divider" && (
              <Divider sx={{ borderColor: "#ffffff1f" }} />
            )}
            {navItem.type === "head" && (
              <Typography
                variant="h6"
                className="fc3"
                sx={{
                  fontWeight: "bolder",
                  textTransform: "uppercase",
                  textAlign: "center",
                  paddingTop: "15px",
                  paddingBottom: "10px",
                }}
              >
                <LanguageTranslate translateKey={navItem.title as string} />
              </Typography>
            )}
            {/* {localStorage.getItem("tutorial") == "true" &&
              navItem.type === "tutorial" && (
                <Tutorial curStep={tutorialRestartStep} placement="top">
                  <Box
                    onClick={() => setTutorialOn()}
                    className={tutorialOn && "nav-bar-item active"}
                  >
                    <Tooltip
                      title={
                        "You can always restart the tutorial by clicking here"
                      }
                      placement="right"
                    >
                      <ListItemButton>
                        <img
                          src={`/assets/images/${navItem.icon}`}
                          style={{
                            width: "22px",
                            height: "22px",
                            marginRight: "34px",
                          }}
                          alt="icon"
                        />
                        <ListItemText
                          primary={tutorialOn ? "CANCEL Tutorial" : "Tutorial"}
                        />
                      </ListItemButton>
                    </Tooltip>
                  </Box>
                </Tutorial>
              )} */}
          </React.Fragment>
        ))}

        <Box sx={{ display: "flex", px: 2, pt: 2 }}>
          {navConfig.navBar.left.map(
            (navItem, index) =>
              navItem.type === "social" && (
                <a target="_blank" href={navItem.path || ""} key={index}>
                  <img
                    src={navItem.icon}
                    style={{ height: "32px", marginRight: "7px" }}
                    alt="social icon"
                  />
                </a>
              )
          )}
        </Box>
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            id="language-button"
            aria-controls={languageOpen ? "language-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={languageOpen ? "true" : undefined}
            onClick={handleClick}
            sx={{ color: "white" }}
          >
            <img
              src={`/assets/images/flags/${language}.svg`}
              style={{ width: "30px" }}
            />
            <ArrowDropDownIcon />
          </Button>
          <Menu
            id="language-menu"
            anchorEl={anchorEl}
            open={languageOpen}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "language-button",
            }}
          >
            {languages.map((item, index) => (
              <MenuItem key={index} onClick={() => handleLanguage(item.title)}>
                <img
                  src={`/assets/images/flags/${item.title}.svg`}
                  style={{ width: "30px", marginRight: "10px" }}
                />{" "}
                {item.name}
              </MenuItem>
            ))}
          </Menu>
          {navConfig.navBar.left.map(
            (navItem, index) =>
              navItem.type === "privacy" && (
                <NavLink
                  key={index}
                  to={navItem.path || ""}
                  style={{ color: "gray" }}
                  className={({ isActive }) =>
                    "nav-bar-item " + (isActive ? "active" : "")
                  }
                >
                  <Tooltip title={navItem.title || ""} placement="right">
                    <ListItemButton>
                      <ListItemText
                        primary={
                          <LanguageTranslate
                            translateKey={navItem.title as string}
                          />
                        }
                        className="fc-gray"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    </ListItemButton>
                  </Tooltip>
                </NavLink>
              )
          )}
        </Box>
        {navConfig.navBar.left.map(
          (navItem, index) =>
            navItem.type === "footer" && (
              <a
                href="https://cryptogames.agency"
                target="_blank"
                className="fc-gray td-none"
                key={index}
              >
                <Card
                  key={index}
                  sx={{ m: 2, p: 2, color: "inherit" }}
                  className="bg-c1"
                >
                  <Typography
                    variant="caption"
                    color="inherit"
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <LanguageTranslate
                      translateKey={navItem.title1 as string}
                    />
                    <img
                      src="/assets/images/heart.png"
                      alt="favorite"
                      style={{
                        width: "14px",
                        height: "14px",
                        margin: "0 10px",
                      }}
                    />

                    <LanguageTranslate
                      translateKey={navItem.title2 as string}
                    />
                  </Typography>
                </Card>
              </a>
            )
        )}
      </List>
    </Box>
  );
};

export default NavList;

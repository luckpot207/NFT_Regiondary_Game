import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
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
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { AppSelector } from "../../store";
import { navConfig } from "../../config/nav.config";
import { commonState, updateCommonState } from "../../reducers/common.reduer";
import { getTranslation } from "../../utils/utils";
import gameConfig from "../../config/game.config";

const NavList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { language } = AppSelector(commonState);

  const [anchorEl, setAnchorEl] = useState(null);
  const languageOpen = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguage = (value: any) => {
    setAnchorEl(null);
    localStorage.setItem("lang", value);

    const location = window.location;
    const pathname = location.pathname;
    dispatch(
      updateCommonState({
        language: value,
      })
    );
    navigate(pathname);
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
              <a target="_blank" className="nav-bar-item" href={navItem.path}>
                <Tooltip title={navItem.tooltip || ""} placement="right">
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
                    <ListItemText primary={getTranslation(navItem.title)} />
                  </ListItemButton>
                </Tooltip>
              </a>
            )}
            {navItem.type === "navlink" && (
              <NavLink
                to={navItem.path || ""}
                className={({ isActive }) =>
                  "nav-bar-item " + (isActive ? "active" : "")
                }
                onClick={() =>
                  dispatch(updateCommonState({ isSideBarOpen: false }))
                }
              >
                <Tooltip title={navItem.tooltip || ""} placement="right">
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
                        getTranslation(navItem.title) +
                        (navItem.path
                          ? navItem.path.indexOf("marketplace") > -1
                            ? " (Coming Soon)"
                            : ""
                          : "")
                      }
                    />
                  </ListItemButton>
                </Tooltip>
              </NavLink>
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
                {getTranslation(navItem.title)}
              </Typography>
            )}
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
              src={`/assets/images/flags/${
                gameConfig.languages.find((item) => item.title == language)?.img
              }`}
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
            {gameConfig.languages.map((item: any, index: any) => (
              <MenuItem key={index} onClick={() => handleLanguage(item.title)}>
                <img
                  src={`/assets/images/flags/${item.img}`}
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
                  <Tooltip title={navItem.tooltip || ""} placement="right">
                    <ListItemButton>
                      <ListItemText
                        primary={getTranslation(navItem.title)}
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
                href={gameConfig.companySiteUrl}
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
                    {getTranslation(navItem.title1)}
                    <img
                      src="/assets/images/heart.png"
                      alt="favorite"
                      style={{
                        width: "14px",
                        height: "14px",
                        margin: "0 10px",
                      }}
                    />

                    {getTranslation(navItem.title2)}
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

import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Fade,
  Popper,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import "./Tutorial.css";
import { useNavigate } from "react-router-dom";
import { AppSelector } from "../../store";

const Tutorial = ({ children, ...rest }: any) => {
  const { curStep, placement, isHuntable } = rest;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tutorialStep, stepInfo, tutorialOn } = AppSelector(gameState);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const tutorialSelector = useRef(null);

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? "tutorial-popper" : undefined;

  let show =
    tutorialOn &&
    tutorialStep.filter((item: any) => item == curStep).length > 0;

  const handleTutorialNext = () => {
    let summonWarriorQuantityBtn = document.getElementById(
      "summon-warrior-quantity"
    );
    let summonBeastQuantityBtn = document.getElementById(
      "summon-beast-quantity"
    );

    switch (curStep) {
      case 0:
        dispatch(updateState({ tutorialStep: [1] }));
        break;
      case 1:
        navigate("/warriors");
        break;
      case 2:
        summonWarriorQuantityBtn?.click();
        dispatch(updateState({ tutorialStep: [3], isSideBarOpen: false }));
        break;
      case 3:
        const summonWarrior1Btn = document.getElementById("summon-warrior-1");
        summonWarrior1Btn?.click();
        dispatch(updateState({ isSideBarOpen: false }));
        break;
      case 4:
        dispatch(updateState({ tutorialStep: [5], isSideBarOpen: false }));
        break;
      case 5:
        summonWarriorQuantityBtn?.click();
        break;
      case 6:
        dispatch(updateState({ tutorialStep: [7], isSideBarOpen: true }));
        break;
      case 7:
        navigate("/beasts");
        break;
      case 8:
        summonBeastQuantityBtn?.click();
        dispatch(updateState({ tutorialStep: [9], isSideBarOpen: false }));
        break;
      case 9:
        const summonBeast1Btn = document.getElementById("summon-beast-1");
        summonBeast1Btn?.click();
        dispatch(updateState({ isSideBarOpen: false }));
        break;
      case 10:
        dispatch(updateState({ tutorialStep: [11], isSideBarOpen: false }));
        break;
      case 11:
        dispatch(updateState({ tutorialStep: [12] }));
        break;
      case 12:
        navigate("/createlegions");
        break;
      case 13:
        dispatch(updateState({ tutorialStep: [14], isSideBarOpen: false }));
        break;
      case 14:
        dispatch(updateState({ tutorialStep: [13], isSideBarOpen: false }));
        break;
      case 15:
        const firstLegionAddSuppliesBtn = document.getElementById(
          "first-legion-add-supply"
        );
        firstLegionAddSuppliesBtn?.click();
        break;
      case 16:
        const addSupplieFromWalletBtn = document.getElementById(
          "add-supplies-from-wallet"
        );
        addSupplieFromWalletBtn?.click();
        break;
      case 17:
        navigate("/hunt");
        break;
      case 18:
        const huntMonster1Btn = document.getElementById("hunt-monster1");
        if (isHuntable) {
          huntMonster1Btn?.click();
        }
        break;
      case 19:
        dispatch(updateState({ tutorialStep: [20] }));
        break;
      case 20:
        dispatch(updateState({ tutorialRestartStep: 21, tutorialStep: [21] }));
        break;
      case 21:
        navigate("/");
        dispatch(
          updateState({
            tutorialOn: true,
            tutorialStep: [1],
            isSideBarOpen: true,
          })
        );
        break;
      default:
        break;
    }
  };

  const handleTutorialCancel = () => {
    dispatch(updateState({ tutorialOn: false }));
  };

  const setTutorialClassName = () => {
    let className = "tutorial-" + placement;
    return className;
  };

  useEffect(() => {
    setAnchorEl(tutorialSelector.current);
    setOpen(true);
  }, []);

  return (
    <>
      <div aria-describedby={id + "-" + curStep} ref={tutorialSelector}>
        {children}
      </div>
      <Popper
        id={id + "-" + curStep}
        open={open}
        anchorEl={anchorEl}
        transition
        placement={placement}
        disablePortal={false}
        modifiers={[
          {
            name: "flip",
            enabled: false,
            options: {
              altBoundary: true,
              rootBoundary: "document",
              padding: 8,
            },
          },
          {
            name: "preventOverflow",
            enabled: true,
            options: {
              altAxis: false,
              altBoundary: true,
              tether: true,
              rootBoundary: "document",
              padding: 8,
            },
          },
        ]}
      >
        {show ? (
          ({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Card
                sx={{
                  p: 1,
                  background: "white",
                  color: "black",
                  width: 300,
                }}
                className={setTutorialClassName()}
              >
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {curStep == 0 ? "" : "Step " + curStep}
                  </Typography>
                  <Typography variant="body2">
                    {stepInfo[curStep]?.desc}
                  </Typography>
                </CardContent>
                <CardActions sx={{ display: "flex" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{ ml: "auto" }}
                    onClick={() => handleTutorialCancel()}
                  >
                    Cancel
                  </Button>
                  {curStep == 0 &&
                  localStorage.getItem("tutorialmode") == "expert" ? (
                    <></>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleTutorialNext()}
                      sx={
                        curStep == 18 && !isHuntable
                          ? { color: "white", background: "black" }
                          : {}
                      }
                    >
                      {curStep == 18 && !isHuntable
                        ? "Can't Hunt"
                        : curStep == 18 && isHuntable
                        ? "Hunt"
                        : curStep == 21
                        ? "Restart"
                        : "Next"}
                    </Button>
                  )}
                </CardActions>
                {placement == "top" && (
                  <div className="tutorial-bottom-arrow"></div>
                )}
                {placement == "bottom" && (
                  <div className="tutorial-top-arrow"></div>
                )}
                {placement == "left" && (
                  <div className="tutorial-right-arrow"></div>
                )}
                {placement == "right" && (
                  <div className="tutorial-left-arrow"></div>
                )}

                {placement == "top-start" && (
                  <div className="tutorial-bottom-start-arrow"></div>
                )}
                {placement == "bottom-start" && (
                  <div className="tutorial-top-start-arrow"></div>
                )}
                {placement == "left-start" && (
                  <div className="tutorial-right-start-arrow"></div>
                )}
                {placement == "right-start" && (
                  <div className="tutorial-left-start-arrow"></div>
                )}

                {placement == "top-end" && (
                  <div className="tutorial-bottom-end-arrow"></div>
                )}
                {placement == "bottom-end" && (
                  <div className="tutorial-top-end-arrow"></div>
                )}
                {placement == "left-end" && (
                  <div className="tutorial-right-end-arrow"></div>
                )}
                {placement == "right-end" && (
                  <div className="tutorial-left-end-arrow"></div>
                )}
              </Card>
            </Fade>
          )
        ) : (
          <></>
        )}
      </Popper>
    </>
  );
};

export default Tutorial;

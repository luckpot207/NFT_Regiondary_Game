import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Input,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useWeb3React } from "@web3-react/core";
import React, { useState, useEffect } from "react";
import { Spinner } from "../../../components/Buttons/Spinner";
import {
  addContactInfo,
  editContactInfo,
  gameState,
  getContactInfo,
} from "../../../reducers/cryptolegions.reducer";
import ApiService from "../../../services/api.service";
import { AppDispatch, AppSelector } from "../../../store";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { formatNumber, showWallet } from "../../../utils/utils";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import { useDispatch } from "react-redux";

const useStyles = makeStyles({
  leaderboard: {
    border: "3px solid #f66810",
    borderRadius: 5,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    background: "#16161699",
    position: "relative",
  },
});

const Leaderboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  // Hook Info
  const { contactInfo } = AppSelector(gameState);
  console.log("contract info: ", contactInfo);
  const classes = useStyles();

  // Account & Web3
  const { account } = useWeb3React();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isUpdateTGDialogOpen, setIsUpdateTGDialogOpen] = useState(false);

  const [telegram, setTelegram] = useState("");

  // Functions
  const getBalance = async () => {
    setIsLoading(true);
    try {
      const { data } = await ApiService.getLeaderboardInfo(account as string);
      console.log("leaderboard info: ", data);
      const { player, memberInfo } = data.data;
      console.log(player, memberInfo);
      setUserList(player);
      if (memberInfo && !memberInfo.deleted) {
        console.log("member");
        setIsChecked(true);
      } else {
        console.log("not member");
        setIsChecked(false);
      }
      if (contactInfo) {
        if (contactInfo.lastTG === "") {
          setTelegram(contactInfo.firstTG);
        } else {
          setTelegram(contactInfo.lastTG);
        }
      } else {
        setTelegram("");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const onChangeCheck = (e: any) => {
    if (!isChecked) {
      handleAddUser();
    } else {
      setIsRemoveDialogOpen(true);
    }
  };

  const handleAddUser = async () => {
    setIsAdding(true);
    try {
      const { data } = await ApiService.addToLeaderboard(account as string);
      toast.success(data.msg);
      setIsChecked(true);
      setIsUpdateTGDialogOpen(true);
      await getBalance();
    } catch (error) {
      console.log(error);
    }
    setIsAdding(false);
  };

  const handleRemoveUser = async () => {
    setIsRemoving(true);
    try {
      const { data } = await ApiService.removeFromLeaderboard(
        account as string
      );
      toast.success(data.msg);
      await getBalance();
      setIsRemoveDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
    setIsRemoving(false);
  };

  const handleUpdateTGname = () => {
    setIsSigning(true);
    if (contactInfo) {
      dispatch(
        editContactInfo({
          wallet: account?.toLowerCase() as string,
          tgname: telegram,
        })
      )
        .then((res) => {
          dispatch(getContactInfo(account?.toLowerCase()));
          setIsUpdateTGDialogOpen(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      dispatch(
        addContactInfo({
          wallet: account?.toLowerCase() as string,
          tgname: telegram,
        })
      )
        .then((res) => {
          dispatch(getContactInfo(account?.toLowerCase()));
          setIsUpdateTGDialogOpen(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setIsSigning(false);
  };

  const handleRemoveDialogClose = () => {
    setIsRemoveDialogOpen(false);
  };

  const handleDialogClose = () => {
    setIsUpdateTGDialogOpen(false);
  };

  const onCompleteCounterDown = () => {
    getBalance();
    return {
      shouldRepeat: true,
      delay: 0,
    };
  };

  // UseEffect
  useEffect(() => {
    getBalance();
  }, [contactInfo]);

  return (
    <Box>
      <Box sx={{ width: "100%", mb: 4, position: "relative" }}>
        <Box sx={{ position: "absolute" }}></Box>
        <Grid spacing={2} container>
          <Grid item md={3} sm={0} xs={0}></Grid>
          <Grid item md={6} sm={12} xs={12}>
            <Box className={classes.leaderboard}>
              <Box sx={{ position: "absolute", right: 15, top: 15 }}>
                {isLoading ? (
                  <Spinner color={"white"} size={24} />
                ) : (
                  <CountdownCircleTimer
                    isPlaying
                    duration={600}
                    colors={["#f66810", "#e89f38", "#f66810", "#a44916"]}
                    colorsTime={[7, 5, 2, 0]}
                    onComplete={() => onCompleteCounterDown()}
                    strokeWidth={3}
                    size={24}
                  ></CountdownCircleTimer>
                )}
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  borderBottom: "1px solid #fff",
                  marginBottom: 3,
                }}
              >
                LEADERBOARD
              </Typography>

              <Box>
                <Grid
                  spacing={2}
                  container
                  className=""
                  style={{ fontWeight: "bold" }}
                >
                  <Grid item xs={3}>
                    Rank
                  </Grid>
                  <Grid item xs={3}>
                    Wallet
                  </Grid>
                  <Grid item xs={3}>
                    Total AP
                  </Grid>
                  <Grid item xs={3}>
                    Total Won
                  </Grid>
                </Grid>
                {userList.map((user, index) => (
                  <Grid spacing={2} container className="fc1" key={index}>
                    <Grid item xs={3}>
                      #{index + 1}
                    </Grid>
                    <Grid item xs={3}>
                      {showWallet(3, 1, user["address"])}
                    </Grid>
                    <Grid item xs={3}>
                      {formatNumber(Math.floor(user["totalAttackPower"]))}
                    </Grid>
                    <Grid item xs={3}>
                      ${formatNumber(Math.floor(user["totalWon"]))}
                    </Grid>
                  </Grid>
                ))}

                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => onChangeCheck(e)}
                    className="mr-2"
                  />
                  {isChecked ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      You are participating in the Leaderboard.{" "}
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          marginLeft: 2,
                          borderColor: "gray",
                        }}
                        onClick={() => setIsUpdateTGDialogOpen(true)}
                      >
                        Update TG Name
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography sx={{ marginRight: 2 }}>
                        Check this box to participate in the Leaderboard and win
                        big prizes.
                      </Typography>
                      {isAdding && <Spinner color="white" size={24} />}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item md={3} sm={0} xs={0}></Grid>
        </Grid>
      </Box>
      <Dialog open={isRemoveDialogOpen}>
        <DialogContent>
          Are you sure you want to remove your wallet from Leaderboard?
          <br />
          Once your wallet is removed, you will not be eligible for the
          Leaderboard prizes anymore.
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => handleRemoveDialogClose()}
            variant="contained"
            sx={{ color: "white", fontWeight: "bold" }}
            disabled={isRemoving}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleRemoveUser()}
            variant="outlined"
            sx={{ fontWeight: "bold" }}
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Spinner color="white" size={24} />
            ) : (
              "Yes, remove me"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isUpdateTGDialogOpen}>
        <DialogTitle>
          <MdClose
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => handleDialogClose()}
          ></MdClose>
        </DialogTitle>
        <DialogContent>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              Your wallet has been added to the Leaderboard competition.
            </Typography>
            <br />
            Every two weeks, on the 1st and 15th day of the month, several
            wallets listed on the Leaderboard win various legions with a value
            between 250-750 USD each. Please consult our Whitepaper for the
            prizes for the current round.
            <br />
            <Typography sx={{ fontWeight: "bold" }}>
              Enter your Telegram name so we can keep you posted if you win one
              of the prizes:
            </Typography>
            <Input
              placeholder="TG Name"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
            <br />
            <br />
            <Button
              variant="contained"
              disabled={isSigning}
              onClick={() => handleUpdateTGname()}
            >
              I want to win, sign me up.{" "}
              {isSigning && <Spinner color="white" size={20} />}
            </Button>
            <br />
            <br />
            <br />
            <span style={{ fontSize: 12 }}>
              Your Telegram name will stay private and secure, will never be
              shared, and you will only be potentially contacted by the
              founder/dev Danny from @ItsDannyH.
            </span>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Leaderboard;

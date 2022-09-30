import {
    Box,
    Dialog,
    DialogContent,
    Typography,
    DialogTitle,
} from "@mui/material";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { AppDispatch, AppSelector } from "../../store";
import { IVoteInput } from "../../interfaces";
import { gameState, updateState, vote, getVoteByAddress, getVoteStatus } from "../../reducers/cryptolegions.reducer";
import FireBtn from "../Buttons/FireBtn";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { toast } from "react-toastify";

const VoteModal: React.FC = () => {
    // Hook Info
    const [status, setStatus] = React.useState<boolean>(false);
    const [voteExpiredLeftDateTime, setVoteExpiredLeftDateTime] = React.useState("");
    const dispatch: AppDispatch = useDispatch();
    const { language, allowVote, alreadyVoted, voteExpired, lastestVoteDate, expireVoteDate } = AppSelector(gameState);
    const { account } = useWeb3React();
    const handleSubmit = async () => {
        if (!account) {
            toast.error("You must connect your wallet!");
            handleClose();
            return;
        }

        dispatch(
            vote({
                address: account as string,
                vote: status as boolean,
            })
        ).then(() => {
            dispatch(
                getVoteStatus()
            );
            dispatch(
                getVoteByAddress({ address: account as string })
            );
        });
        handleClose();
    };

    const handleClose = () => {
        dispatch(
            updateState({
                allowVote: false,
            })
        );
    };

    const calcVoteExpireDateTime = () => {
        if (alreadyVoted && !voteExpired) {
            setVoteExpiredLeftDateTime(`${Math.floor((new Date(lastestVoteDate).getTime() - new Date().getTime() + 3 * 24 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000))} days ${Math.floor((new Date(lastestVoteDate).getTime() - new Date().getTime() + 3 * 24 * 60 * 60 * 1000) % (24 * 60 * 60 * 1000) / (60 * 60 * 1000))} hours ${Math.floor((new Date(lastestVoteDate).getTime() - new Date().getTime() + 3 * 24 * 60 * 60 * 1000) % (60 * 60 * 1000) / (60 * 1000))} minutes`);
        }
    };

    React.useEffect(() => {
        realTimeUpdate();
    }, []);

    const realTimeUpdate = () => {
        setInterval(() => {
            calcVoteExpireDateTime();
        }, 5000);
    };

    //
    return (
        <Dialog open={allowVote.valueOf()} onClose={handleClose}>
            <DialogContent>
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            marginBottom: 3,
                        }}
                    >
                        Vote about the current economy status:
                    </Typography>
                </Box>
                <Box
                    sx={{
                        textAlign: "Center",
                    }}
                >
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                        sx={{
                            alignItems: "center",
                            marginBottom: 2,
                        }}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio />}
                            onClick={() => setStatus(true)}
                            label="Good"
                            sx={{ width: "80px" }}
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio />}
                            onClick={() => setStatus(false)}
                            label="Bad"
                            sx={{ width: "80px" }}
                        />
                    </RadioGroup>

                    <Typography
                        fontSize={15}
                        sx={{
                            fontWeight: "normal",
                            textAlign: "left",
                            marginBottom: 0,
                        }}
                    >
                        Your GOOD/BAD vote expires in {voteExpiredLeftDateTime}.
                    </Typography>
                    <Typography
                        fontSize={15}
                        sx={{
                            fontWeight: "normal",
                            textAlign: "left",
                            marginBottom: 2,
                        }}
                    >
                        You can change your vote, or vote the same to restart the countdown timer.
                    </Typography>

                    

                    <FireBtn
                        sx={{
                            mb: 1,
                            width: "30%",
                            wordBreak: "break-word",
                            fontSize: 14,
                            textAlign: "center",
                        }}
                        onClick={handleSubmit}
                        aria-describedby="summon-beast-btn"
                    >
                        Vote
                    </FireBtn>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default VoteModal;

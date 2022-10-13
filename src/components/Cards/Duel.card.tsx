import {
    Box,
    Card,
    CardMedia,
    Typography,
} from "@mui/material";

import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { I_Legion, I_Duel, I_Division } from "../../interfaces";
import { useDispatch } from "react-redux";
import { AppSelector } from "../../store";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import FireBtn from "../Buttons/FireBtn";
import GreyBtn from "../Buttons/GreyBtn";
import { formatNumber, getTranslation } from "../../utils/utils";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { cancelDuel, duelCounter } from "../../web3hooks/contractFunctions";
import { useDuelSystem, useLegion } from "../../web3hooks/useContract";
import { getAllDuelsAct } from "../../helpers/duel";

type Props = {
    duel: I_Duel;
};

const DuelCard: React.FC<Props> = ({ duel }) => {
    // Hook info
    const dispatch = useDispatch();
    const {
        duelStatus,
        allLegions,
        divisions,
        currentLegionIndexForDuel,
    } = AppSelector(gameState);
    const { account } = useWeb3React();
    const duelContract = useDuelSystem();
    const legionContract = useLegion();

    const [loaded, setLoaded] = useState(false);
    const [leftTime, setLeftTime] = useState("");

    // Functions
    const handleImageLoaded = () => {
        setLoaded(true);
    };

    const [duelFlag, setDuelFlag] = useState(false);

    const handleDuelBtnClick = () => {
        if (duelFlag == false) {
            toast.error("You can't duel using your selected legion.");
            return;
        }
        dispatch(
            updateState({
                joinDuelModalOpen: true,
                currentDuelId: duel.duelId.valueOf(),
                endDateJoinDuel: duel.endDateTime.valueOf(),
            }
            )
        );
    }

    const handleUpdatePrediction = () => {
        dispatch(
            updateState(
                {
                    updatePredictionModalOpen: true,
                    currentDuelId: duel.duelId.valueOf(),
                    endDateJoinDuel: duel.endDateTime.valueOf(),
                }
            )
        );
    }

    const handleCancelDuel = async () => {
        cancelDuel(duelContract, account, duel.duelId);
    }

    const handleDeleteBtnClick = () => {
        Swal.fire({
            title: "Cancel Duel",
            text: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f66810",
            cancelButtonColor: "#d33",
            confirmButtonText: "Cancel Duel",
            background: "#111",
            color: "white",
        }).then((result) => {
            if (result.isConfirmed) {
                handleCancelDuel();
            }
            getAllDuelsAct(dispatch, account, duelContract, legionContract);
        });
    }

    React.useEffect(() => {
        setDuelFlag(false);
        divisions.map((division: I_Division, index: Number) => {
            if (duel.creatorLegion.attackPower >= division.minAP && duel.creatorLegion.attackPower < division.maxAP) {
                if (allLegions[currentLegionIndexForDuel.valueOf()].attackPower >= division.minAP && allLegions[currentLegionIndexForDuel.valueOf()].attackPower < division.maxAP) {
                    setDuelFlag(true);
                }
            }
        });
        realTimeUpdate();
    }, [currentLegionIndexForDuel]);

    const realTimeUpdate = () => {
        setTimeout(() => {
            const left_time = (new Date(duel.endDateTime.valueOf()).getTime() - new Date().getTime());
            setLeftTime("" + Math.floor(left_time / (60 * 60 * 1000)) + "h " + Math.floor(left_time % (60 * 60 * 1000) / (60 * 1000)) + "m " + Math.floor(left_time % (60 * 1000) / (1000)) + "s")
            realTimeUpdate();
        }, 1000);
    };

    const duelResult = () => {
        const priceDifference1 = Math.round(Math.abs(duel.result.valueOf() - duel.creatorEstmatePrice.valueOf()) * 100) / 100;
        const priceDifference2 = Math.round(Math.abs(duel.result.valueOf() - duel.joinerEstmatePrice.valueOf()) * 100) / 100;
        if (priceDifference1 == priceDifference2) {
            return 0;
        } else if (priceDifference1 > priceDifference2) {
            return 1;
        } else {
            return 2;
        }
    }

    return <Box>
        {
            duelStatus.valueOf() == 1
                ?
                <>
                    <Card sx={{ position: "relative" }}>
                        <CardMedia
                            component={"img"}
                            image={duel.creatorLegion.jpg.valueOf()}
                            alt="Legion Image"
                            loading="lazy"
                            onLoad={handleImageLoaded}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                position: "absolute",
                                top: "15px",
                                left: "20px",
                                fontWeight: "bold",
                            }}
                        >
                            {duel.creatorLegion.name}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                position: "absolute",
                                alignItems: "center",
                                top: "15px",
                                right: "10px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            <div>
                                {leftTime}
                            </div>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                position: "absolute",
                                alignItems: "center",
                                bottom: "10px",
                                left: "calc(50% - 50px)",
                                fontWeight: "bold",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.4rem",
                                    textShadow:
                                        "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
                                }}
                            >
                                {formatNumber(duel.creatorLegion.attackPower)} AP
                            </Typography>

                        </Box>
                        {
                            duel.isMine
                                ? <Typography
                                    variant="subtitle2"
                                    sx={{
                                        position: "absolute",
                                        bottom: "8px",
                                        left: "20px",
                                        fontWeight: "bold",
                                        fontSize: "1.4rem",
                                        textShadow:
                                            "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
                                    }}
                                >
                                    ${duel.betPrice}
                                </Typography>
                                : <Typography
                                    variant="subtitle2"
                                    sx={{
                                        position: "absolute",
                                        bottom: "8px",
                                        left: "20px",
                                        color: "darkgrey",
                                    }}
                                >

                                    #{duel.creatorLegion.id}
                                </Typography>
                        }
                        {
                            !duel.isMine
                                ? <Typography
                                    variant="subtitle2"
                                    sx={{
                                        position: "absolute",
                                        bottom: "8px",
                                        right: "20px",
                                        fontWeight: "bold",
                                        fontSize: "1.4rem",
                                        textShadow:
                                            "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
                                    }}
                                >
                                    ${duel.betPrice}
                                </Typography>
                                : <img
                                    style={{
                                        position: "absolute",
                                        bottom: "20px",
                                        right: "20px",
                                        width: "2rem",
                                        cursor: "pointer",
                                        filter: "box-shadow(0px 0px 100px #fff)"
                                    }}
                                    onClick={handleDeleteBtnClick}
                                    // src="/assets/images/execute.png"
                                    src="/assets/images/deleteBtn.png"
                                ></img>
                        }

                    </Card>
                    <Box sx={{ textAlign: "center", mt: 1 }}>
                        {
                            duel.isMine
                                ?
                                <FireBtn
                                    sx={{ fontWeight: "bold", fontSize: 16, px: 2 }}
                                    onClick={handleUpdatePrediction}
                                >
                                    Update Prediction
                                </FireBtn>
                                : duelFlag
                                    ? <FireBtn
                                        sx={{ fontWeight: "bold", fontSize: 16, px: 2 }}
                                        onClick={handleDuelBtnClick}
                                    >
                                        Duel
                                    </FireBtn>
                                    : <GreyBtn
                                        sx={{ fontWeight: "bold", fontSize: 16, px: 2 }}
                                        onClick={handleDuelBtnClick}
                                    >
                                        Duel
                                    </GreyBtn>
                        }

                    </Box>
                </>
                : duelStatus.valueOf() == 2
                    ? <>
                        <Box sx={{
                            border: "2px #00d0ff solid",
                            padding: "4px",
                            display: 'flex',
                            flexDirection: 'row',
                            position: 'relative',
                        }}>
                            <Card sx={{ position: 'relative' }}>
                                <CardMedia
                                    component={"img"}
                                    image={duel.creatorLegion.jpg.valueOf()}
                                    alt="Legion Image"
                                    loading="lazy"
                                    onLoad={handleImageLoaded}
                                />
                                <Typography
                                    sx={{
                                        position: "absolute",
                                        top: "15px",
                                        left: "20px",
                                        fontWeight: "bold",
                                        fontSize: "1em"
                                    }}
                                >
                                    {duel.creatorLegion.name}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        position: "absolute",
                                        alignItems: "center",
                                        bottom: "10px",
                                        left: "calc(50% - 50px)",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            textShadow:
                                                "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
                                        }}
                                    >
                                        {formatNumber(duel.creatorLegion.attackPower)} AP
                                    </Typography>

                                </Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        position: "absolute",
                                        bottom: "8px",
                                        left: "20px",
                                        color: "darkgrey",
                                    }}
                                >
                                    #{duel.creatorLegion.id}
                                </Typography>
                            </Card>
                            <Card sx={{ position: 'relative', marginLeft: '10px' }}>
                                <CardMedia
                                    component={"img"}
                                    image={duel.joinerLegion.jpg.valueOf()}
                                    alt="Legion Image"
                                    loading="lazy"
                                    onLoad={handleImageLoaded}
                                />
                                <Typography
                                    sx={{
                                        position: "absolute",
                                        top: "15px",
                                        left: "20px",
                                        fontWeight: "bold",
                                        fontSize: "1em",
                                    }}
                                >
                                    {duel.joinerLegion.name}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        position: "absolute",
                                        alignItems: "center",
                                        bottom: "10px",
                                        left: "calc(50% - 50px)",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            textShadow:
                                                "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
                                        }}
                                    >
                                        {formatNumber(duel.joinerLegion.attackPower)} AP
                                    </Typography>

                                </Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        position: "absolute",
                                        bottom: "8px",
                                        left: "20px",
                                        color: "darkgrey",
                                    }}
                                >
                                    #{duel.joinerLegion.id}
                                </Typography>
                            </Card>
                            <Box sx={{
                                width: "100%",
                                height: "100%",
                                paddingLeft: "20%",
                                paddingRight: "20%",
                                position: "absolute",
                                top: "0px",
                                left: "0px",
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexDirection: "row"
                            }}>
                                <Typography
                                    sx={{
                                        fontSize: "1.4em",
                                        fontWeight: "bold",
                                        color: "#0df8f9",
                                        WebkitTextStroke: "1px black",
                                    }}
                                >
                                    ${duel.creatorEstmatePrice}
                                </Typography>
                                <img
                                    src="/assets/images/vs.png"
                                    style={{
                                        width: "80px",
                                    }}
                                    alt="VS"
                                />
                                <Typography
                                    sx={{
                                        fontSize: "1.4em",
                                        fontWeight: "bold",
                                        color: "#0df8f9",
                                        WebkitTextStroke: "1px black",
                                    }}
                                >
                                    ${duel.joinerEstmatePrice}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    position: "absolute",
                                    alignItems: "center",
                                    top: "15px",
                                    right: "10px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    // color: huntStatusColor,
                                }}
                            >
                                <div>
                                    {leftTime}
                                </div>
                            </Box>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    position: "absolute",
                                    bottom: "8px",
                                    right: "20px",
                                    fontWeight: "bold",
                                    fontSize: "1.4rem",
                                    textShadow:
                                        "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
                                }}
                            >
                                ${duel.betPrice}
                            </Typography>
                        </Box>
                    </>
                    : <>
                        <Box sx={{
                            border: "2px #00d0ff solid",
                            padding: "4px",
                            display: 'flex',
                            flexDirection: 'row',
                            position: 'relative',
                        }}>
                            <Card sx={{ position: 'relative' }}>
                                <CardMedia
                                    component={"img"}
                                    image={duel.creatorLegion.jpg.valueOf()}
                                    alt="Legion Image"
                                    loading="lazy"
                                    onLoad={handleImageLoaded}
                                    sx={{
                                        border: "2px solid",
                                        borderColor: duelResult() == 0 ? "orange" : duelResult() == 1 ? "red" : "green"
                                    }}
                                />
                                <Typography
                                    sx={{
                                        position: "absolute",
                                        top: "15px",
                                        left: "20px",
                                        fontWeight: "bold",
                                        fontSize: "1em"
                                    }}
                                >
                                    {duel.creatorLegion.name}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        position: "absolute",
                                        alignItems: "center",
                                        bottom: "10px",
                                        left: "calc(50% - 50px)",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            textShadow:
                                                "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
                                        }}
                                    >
                                        {formatNumber(duel.creatorLegion.attackPower)} AP
                                    </Typography>

                                </Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        position: "absolute",
                                        bottom: "8px",
                                        left: "20px",
                                        color: "darkgrey",
                                    }}
                                >
                                    #{duel.creatorLegion.id}
                                </Typography>
                            </Card>
                            <Card sx={{ position: 'relative', marginLeft: '10px' }}>
                                <CardMedia
                                    component={"img"}
                                    image={duel.joinerLegion.jpg.valueOf()}
                                    alt="Legion Image"
                                    loading="lazy"
                                    onLoad={handleImageLoaded}
                                    sx={{
                                        border: "2px solid",
                                        borderColor: duelResult() == 0 ? "orange" : duelResult() == 1 ? "green" : "red"
                                    }}
                                />
                                <Typography
                                    sx={{
                                        position: "absolute",
                                        top: "15px",
                                        left: "20px",
                                        fontWeight: "bold",
                                        fontSize: "1em",
                                    }}
                                >
                                    {duel.joinerLegion.name}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        position: "absolute",
                                        alignItems: "center",
                                        bottom: "10px",
                                        left: "calc(50% - 50px)",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: "1rem",
                                            textShadow:
                                                "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
                                        }}
                                    >
                                        {formatNumber(duel.joinerLegion.attackPower)} AP
                                    </Typography>

                                </Box>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        position: "absolute",
                                        bottom: "8px",
                                        left: "20px",
                                        color: "darkgrey",
                                    }}
                                >
                                    #{duel.joinerLegion.id}
                                </Typography>
                            </Card>
                            <Box sx={{
                                width: "100%",
                                height: "100%",
                                paddingLeft: "20%",
                                paddingRight: "20%",
                                position: "absolute",
                                top: "0px",
                                left: "0px",
                                display: 'flex',
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexDirection: "row"
                            }}>
                                <Typography
                                    sx={{
                                        fontSize: "1.4em",
                                        fontWeight: "bold",
                                        color: "#0df8f9",
                                        WebkitTextStroke: "1px black",
                                    }}
                                >
                                    ${duel.creatorEstmatePrice}
                                </Typography>
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}>
                                    <img
                                        src="/assets/images/vs.png"
                                        style={{
                                            width: "80px",
                                        }}
                                        alt="VS"
                                    />
                                    <Typography
                                        sx={{
                                            fontSize: "1.2em !important",
                                            color: "#3afcff",
                                            WebkitTextStroke: "0.2px white",
                                        }}
                                    > 
                                        BLST price was ${duel.result}
                                    </Typography>
                                    
                                </Box>
                                <Typography
                                    sx={{
                                        fontSize: "1.4em",
                                        fontWeight: "bold",
                                        color: "#0df8f9",
                                        WebkitTextStroke: "1px black",
                                    }}
                                >
                                    ${duel.joinerEstmatePrice}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    position: "absolute",
                                    alignItems: "center",
                                    top: "15px",
                                    right: "10px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    // color: huntStatusColor,
                                }}
                            >
                                <div>
                                    {duel.endDateTime}
                                </div>
                            </Box>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    position: "absolute",
                                    bottom: "8px",
                                    right: "20px",
                                    fontWeight: "bold",
                                    fontSize: "1.4rem",
                                    textShadow:
                                        "-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000",
                                }}
                            >
                                ${duel.betPrice}
                            </Typography>
                        </Box>
                    </>
        }

    </Box>;
}

export default DuelCard;
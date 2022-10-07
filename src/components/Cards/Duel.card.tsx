import {
    Box,
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Skeleton,
    Tooltip,
    Typography,
} from "@mui/material";

import { useWeb3React } from "@web3-react/core";
import React, { useEffect, useState } from "react";
import { I_Legion, I_Duel } from "../../interfaces";
import { useDispatch } from "react-redux";
import { AppSelector } from "../../store";
import { gameState, updateState } from "../../reducers/cryptolegions.reducer";
import FireBtn from "../Buttons/FireBtn";
import GreyBtn from "../Buttons/GreyBtn";
import { formatNumber, getTranslation } from "../../utils/utils";

type Props = {
    duel: I_Duel;
};

const DuelCard: React.FC<Props> = ({ duel }) => {
    // Hook info
    const dispatch = useDispatch();
    const {
        language,
        showAnimation,
        duelStatus,
    } = AppSelector(gameState);
    const [loaded, setLoaded] = useState(false);
    const [leftTime, setLeftTime] = useState("");

    // Functions
    const handleImageLoaded = () => {
        setLoaded(true);
    };

    React.useEffect(() => {
        realTimeUpdate();
    }, []);

    const realTimeUpdate = () => {
        setTimeout(() => {
            const left_time = (new Date(duel.endDateTime.valueOf()).getTime() - new Date().getTime());
            setLeftTime("" + Math.floor(left_time / (60 * 60 * 1000)) + "h " + Math.floor(left_time % (60 * 60 * 1000) / (60 * 1000)) + "m " + Math.floor(left_time % (60 * 1000) / (1000)) + "s")
            realTimeUpdate();
        }, 1000);
    };
    return <Box>
        {
            duelStatus.valueOf() == 0
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
                                // color: huntStatusColor,
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
                    </Card>

                    <Box sx={{ textAlign: "center", mt: 1 }}>
                        <FireBtn
                            sx={{ fontWeight: "bold", fontSize: 16, px: 2 }}
                        // onClick={() => handleBuyToken()}
                        >
                            Duel
                        </FireBtn>
                    </Box>
                </>
                : duelStatus.valueOf() == 1
                    ? <>
                        <Box sx={{ display: 'flex', flexDirection: 'row', position: 'relative' }}>
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
                                        fontSize: "1.2em",
                                        fontWeight: "bold",
                                        color: "yellow",
                                        WebkitTextStroke: "1px black",
                                    }}
                                >
                                    ${duel.creatorEstmatePrice}
                                </Typography>
                                <img
                                    src="/assets/images/vs.png"
                                    style={{
                                        height: "50px",
                                    }}
                                    alt="VS"
                                />
                                <Typography
                                    sx={{
                                        fontSize: "1.2em",
                                        fontWeight: "bold",
                                        color: "yellow",
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
                    : <></>
        }

    </Box>;
}

export default DuelCard;
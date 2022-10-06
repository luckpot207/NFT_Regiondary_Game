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
    // Functions
    const handleImageLoaded = () => {
        setLoaded(true);
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
            : <></>
        }
        
    </Box>;
}

export default DuelCard;
import {
    Box,
    Card,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    Button,
    ButtonGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
    gameState,
    updateState,
} from "../../../reducers/cryptolegions.reducer";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { NavLink } from "react-router-dom";
import { useWeb3 } from "../../../web3hooks/useContract";
import { AppSelector } from "../../../store";
import LanguageTranslate from "../../../components/UI/LanguageTranslate";
import { I_Duel, I_Legion } from "../../../interfaces";
import OrgMenuItem from "../../../components/UI/OrgMenuItem";
import GreenMenuItem from "../../../components/UI/GreenMenuItem";
import RedMenuItem from "../../../components/UI/RedMenuItem";
import DuelLegionAPFilter from "../../../components/Filters/DuelLegionAP.filter";
import DuelLeftTimeSort from "../../../components/Filters/DuelLeftTime.sort";
import DuelProcessSort from "../../../components/Filters/DuelProcess.sort";
import DuelShowOnlyMineFilter from "../../../components/Filters/DuelShowOnlyMine.filter";
import DuelTypeSort from "../../../components/Filters/DuelType.sort";
import DuelCard from "../../../components/Cards/Duel.card";

const Duel: React.FC = () => {
    const dispatch = useDispatch();
    const {
        language,
        allLegions,
        allDuels,
        duelStatus,
        duelLegionFilterMinAP,
        duelLegionFilterMaxAP,
        duelLegionFilterMinConstAP,
        duelLegionFilterMaxConstAP,
    } = AppSelector(gameState);
    // Account & Web3
    const { account } = useWeb3React();
    const web3 = useWeb3();


    const [currentLegionIndex, setCurrentLegionIndex] = useState<number>(0);

    const handleDuelSort = (val: Number) => {
        dispatch(updateState({ duelStatus: val }));
    };

    const handleSelectLegion = (e: SelectChangeEvent) => {
        const legionIndex = parseInt(e.target.value);
        setCurrentLegionIndex(legionIndex);
    };

    const APFilterVal = allDuels.filter(
        (duel: I_Duel) =>
            duel.creatorLegion.attackPower >= duelLegionFilterMinAP.valueOf() * 1000 &&
            (duelLegionFilterMaxAP === duelLegionFilterMaxConstAP
                ? true
                : duel.creatorLegion.attackPower <= duelLegionFilterMaxAP.valueOf() * 1000)
    );


    return (
        <Box>
            <Grid container spacing={2} sx={{ my: 4 }}>
                <Grid item xs={12}>
                    <Card sx={{ p: 4 }} className="bg-c5">
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={6} md={4}>
                                <Typography
                                    variant="h3" sx={{ fontWeight: "bold", mx: 4 }}
                                >
                                    {duelStatus == 0
                                        ? "Duel"
                                        : duelStatus == 1 ? "Ongoing Dules"
                                            : "Duel Results"}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={4}>
                                <Grid item xs={80} sm={80} md={20}>
                                    <FormControl fullWidth>
                                        <InputLabel id="hunt-legion-select-label">
                                            <LanguageTranslate translateKey="legions" />
                                        </InputLabel>
                                        <Select
                                            labelId="hunt-legion-select-label"
                                            id="hunt-legion-select"
                                            value={currentLegionIndex.toString()}
                                            onChange={handleSelectLegion}
                                        >
                                            {allLegions.map((legion: I_Legion, index: number) =>
                                                legion.huntStatus ? (
                                                    <GreenMenuItem value={index} key={index}>
                                                        {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                                                    </GreenMenuItem>
                                                ) : legion.supplies > 0 ? (
                                                    <OrgMenuItem value={index} key={index}>
                                                        {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                                                    </OrgMenuItem>
                                                ) : (
                                                    <RedMenuItem value={index} key={index}>
                                                        {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                                                    </RedMenuItem>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6} lg={3}>
                    {duelStatus != 0 ? <ButtonGroup><Button onClick={() => handleDuelSort(0)}>Back to Duels</Button></ButtonGroup> : <></>}
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <DuelLegionAPFilter />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                    <DuelProcessSort />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                    <DuelLeftTimeSort />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                    <DuelShowOnlyMineFilter />
                </Grid>
                <Grid item xs={12} md={6} lg={2}>
                    <DuelTypeSort />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                {APFilterVal
                    .map((duel, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <DuelCard duel={duel} />
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
};

export default Duel;

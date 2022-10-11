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
import LoadingBloodstone from "../../../components/UI/LoadingBloodstone";
import FireBtn from "../../../components/Buttons/FireBtn";
import CreateDuelModal from "../../../components/Modals/CreateDuel.modal";
import JoinDuelModal from "../../../components/Modals/JoinDuel.modal";
import ItemPagination from "../../../components/Pagination/Pagination";
import { toast } from "react-toastify";
import UpdatePredictionModal from "../../../components/Modals/UpdatePrediction.modal";



const Duel: React.FC = () => {
    const dispatch = useDispatch();
    const {
        language,
        getAllDulesLoading,
        getAllLegionsLoading,
        allLegions,
        allDuels,
        duelStatus,
        duelLegionFilterMinAP,
        duelLegionFilterMaxAP,
        duelLegionFilterMinConstAP,
        duelLegionFilterMaxConstAP,
        duelJoinLeftMaxTime,
        duelJoinLeftMinTime,
        duelLeftMaxTime,
        duelLeftMinTime,
        duelResultFilterStart,
        duelResultFilterEnd,
        duelJoinLeftMaxConstTime,
        duelJoinLeftMinConstTime,
        duelLeftMaxConstTime,
        duelLeftMinConstTime,
        duelResultFilterStartConst,
        duelResultFilterEndConst,
        duelShowOnlyMine,
        duelType,
        currentLegionIndexForDuel,
        currentPage,
        pageSize,
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
        dispatch(updateState({ currentLegionIndexForDuel: legionIndex }));
    };

    const showCreateDuelModal = () => {
        dispatch(updateState({ createDuelModalOpen: true }));

    }

    const APFilterVal = allDuels.filter(
        (duel: I_Duel) => {
            return duel.creatorLegion.attackPower >= duelLegionFilterMinAP.valueOf() * 1000 &&
                (duelLegionFilterMaxAP === duelLegionFilterMaxConstAP
                    ? true
                    : duel.creatorLegion.attackPower <= duelLegionFilterMaxAP.valueOf() * 1000);
        }
    );

    const StatusFilterVal = APFilterVal.filter(
        (duel: I_Duel) => duel.status == duelStatus
    );

    const TimeFilterVal = StatusFilterVal.filter(
        (duel: I_Duel) => {
            if (duelStatus == 0) {
                const timeLeft: Number = (new Date(duel.endDateTime.valueOf()).getTime() - new Date().getTime()) / (60 * 1000);
                return timeLeft >= duelJoinLeftMinTime.valueOf() &&
                    (duelJoinLeftMaxTime === duelJoinLeftMaxConstTime
                        ? true
                        : timeLeft <= duelJoinLeftMaxTime.valueOf())
            } else if (duelStatus == 1) {
                const timeLeft: Number = (new Date(duel.endDateTime.valueOf()).getTime() - new Date().getTime()) / (60 * 1000);
                return timeLeft >= duelLeftMinTime.valueOf() &&
                    (duelLeftMaxTime === duelLeftMaxConstTime
                        ? true
                        : timeLeft <= duelLeftMaxTime.valueOf())
            } else {
                const daysAgo: Number = (new Date().getTime() - new Date(duel.endDateTime.valueOf()).getTime()) / (24 * 60 * 60 * 1000);
                return daysAgo >= duelResultFilterStart.valueOf() &&
                    (duelResultFilterEnd === duelResultFilterEndConst
                        ? true
                        : daysAgo <= duelResultFilterEnd.valueOf())
            }
        }
    );



    const OnlyMineFilterVal = TimeFilterVal.filter(
        (duel: I_Duel) => duelShowOnlyMine ? duel.creatorAddress == account : true
    )

    const DuelTypeFilterVal = OnlyMineFilterVal.filter(
        (duel: I_Duel) => duel.type == duelType
    )
    return (
        <Box>
            <Grid container spacing={2} sx={{ my: 4 }}>
                <Grid item xs={12}>
                    <Card sx={{ p: 4 }} className="bg-c5">
                        {allLegions.length == 0
                            ? <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingBottom: "10px",
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                }}
                            >
                                <Box
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "calc(17px + 5 * (100vw - 320px) / 1080)",
                                        mr: 1,
                                    }}
                                >
                                    <LanguageTranslate translateKey="noMintedLegion" />
                                </Box>
                                <NavLink to="/createlegions" className="td-none">
                                    <FireBtn>
                                        <LanguageTranslate translateKey="createLegion" />
                                    </FireBtn>
                                </NavLink>
                            </Box>
                            : <Grid container spacing={2}>
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
                                {
                                    duelStatus == 0 ?
                                        <Grid item xs={12} sm={6} md={6} lg={6} >
                                            <FormControl>
                                                <Select
                                                    id="hunt-legion-select"
                                                    value={currentLegionIndex.toString()}
                                                    onChange={handleSelectLegion}
                                                >
                                                    {allLegions
                                                        .map((legion: I_Legion, index: number) =>
                                                            !legion.duelStatus ? (
                                                                <OrgMenuItem value={index} key={index}>
                                                                    {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                                                                </OrgMenuItem>
                                                            ) : legion.attackPower.valueOf() >= 10000 && legion.attackPower <= 70000 ? (
                                                                <GreenMenuItem value={index} key={index}>
                                                                    {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                                                                </GreenMenuItem>
                                                            ) : <RedMenuItem value={index} key={index}>
                                                                {`#${legion.id} ${legion.name} (${legion.attackPower} AP)`}
                                                            </RedMenuItem>
                                                        )}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        : <></>
                                }
                            </Grid>
                        }
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6} lg={3}>
                    <ButtonGroup>
                        {duelStatus != 0 ? <Button onClick={() => handleDuelSort(0)}>Back to Duels</Button> : allLegions.length != 0 ?
                            <Button onClick={() => showCreateDuelModal()}>Create Duel</Button> : <></>}
                    </ButtonGroup>
                </Grid>
            </Grid>
            <Grid container spacing={3} mb={3}>
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
            {
                // getAllDulesLoading.valueOf() || getAllLegionsLoading.valueOf()
                getAllDulesLoading.valueOf()
                    ? <LoadingBloodstone loadingPage="legionsMarketplace" />
                    : <Box>
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            {DuelTypeFilterVal
                                .slice(
                                    pageSize.valueOf() * (currentPage.valueOf() - 1),
                                    pageSize.valueOf() * currentPage.valueOf()
                                )
                                .map((duel, index) => (
                                    duelStatus == 0
                                        ? (<Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                            <DuelCard duel={duel} />
                                        </Grid>)
                                        : (<Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                                            <DuelCard duel={duel} />
                                        </Grid>)
                                ))}
                        </Grid>
                        {
                            DuelTypeFilterVal.length > 0 && (
                                <Box>
                                  <ItemPagination totalCount={DuelTypeFilterVal.length} />
                                </Box>
                              )
                        }
                    </Box>

            }
            <CreateDuelModal />
            <JoinDuelModal />
            <UpdatePredictionModal />
        </Box>
    );
};

export default Duel;

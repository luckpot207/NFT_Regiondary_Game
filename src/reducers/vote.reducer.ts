import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IVoteState } from "../types";
import constants from "../constants";
import ApiService from "../services/api.service";
import { toast } from "react-toastify";

const { endDate } = constants.vote;

let initialState: IVoteState = {
  goodVote: 1,
  badVote: 1,
  playerSentiment: 0,
  alreadyVoted: false,
  voteExpired: false,
  expireVoteDate: "",
  lastestVoteDate: "",
  myVote: true,

  reincarnationProcess: false,
  allowReincarnation: false,
  endDate: endDate,
};

export const getVoteStatus = createAsyncThunk("vote/getVoteCnt", async () => {
  const { data } = await ApiService.getVoteStatus();
  return data;
});

export const getVoteByAddress = createAsyncThunk(
  "vote/getVoteByAddress",
  async ({ address }: { address: string }) => {
    const { data } = await ApiService.getVoteByAddress(address);
    return data;
  }
);

export const vote = createAsyncThunk(
  "vote/addVote",
  async ({ address, vote }: { address: string; vote: boolean }) => {
    const { data } = await ApiService.vote(address, vote);
    return data;
  }
);

export const voteSlice = createSlice({
  name: "vote",
  initialState,
  reducers: {
    updateVoteState: (state: IVoteState, action: PayloadAction<any>) => {
      let keys = Object.keys(action.payload);
      keys.forEach((key) => {
        state[key as keyof IVoteState] = action.payload[key];
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getVoteStatus.pending, (state) => {});
    builder.addCase(getVoteStatus.fulfilled, (state, { payload }) => {
      state.goodVote = payload.goodCnt;
      state.badVote = payload.badCnt;
      if (payload.goodCnt + payload.badCnt != 0) {
        state.playerSentiment = Math.round(
          (payload.goodCnt * 100) / (payload.goodCnt + payload.badCnt)
        );
      } else {
        state.playerSentiment = 0;
      }
    });
    builder.addCase(getVoteStatus.rejected, (state) => {});

    builder.addCase(getVoteByAddress.pending, (state) => {});
    builder.addCase(getVoteByAddress.fulfilled, (state, { payload }) => {
      if (payload.length == 0) {
        state.alreadyVoted = false;
      } else {
        state.alreadyVoted = true;
        state.lastestVoteDate = payload[0].lastest_date;
        if (
          new Date().getTime() -
            new Date(payload[0].lastest_date as string).getTime() <
          3 * 24 * 60 * 60 * 1000
        ) {
          state.voteExpired = false;
          state.expireVoteDate = new Date(
            new Date(
              new Date(payload[0].lastest_date as string).getTime() +
                3 * 24 * 60 * 60 * 1000
            )
          ).toString();
          state.myVote = payload[0].lastest_vote;
        } else {
          state.voteExpired = true;
        }
      }
    });
    builder.addCase(getVoteByAddress.rejected, (state) => {
      toast.error("Failed!");
    });

    builder.addCase(vote.pending, (state) => {});
    builder.addCase(vote.fulfilled, (state, { payload }) => {
      toast.success("Successfully voted!");
    });
    builder.addCase(vote.rejected, (state) => {
      toast.error("Failed!");
    });
  },
});

export const { updateVoteState } = voteSlice.actions;

export const voteState = (state: RootState) => state.vote;

export default voteSlice.reducer;

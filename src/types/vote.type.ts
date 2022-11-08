export interface IVoteState {
  goodVote: Number;
  badVote: Number;
  playerSentiment: Number;
  alreadyVoted: boolean;
  voteExpired: boolean;
  lastestVoteDate: String;
  expireVoteDate: String;
  myVote: boolean;

  reincarnationProcess: boolean;
  allowReincarnation: boolean;
  endDate: String;
}

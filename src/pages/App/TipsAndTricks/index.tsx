import React, { useState, useEffect } from "react";
import { Card, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import ApiService from "../../../services/api.service";
import VideoPlayer from "../../../components/UI/VideoPlayer";
import constants from "../../../constants";

interface ITipsAndTricks {
  _id?: string;
  session: number;
  title: string;
  video: string;
  chapter: [
    {
      _id: string;
      desc: string;
      video: string;
    }
  ];
  done: boolean;
}

const TipsAndTricks: React.FC = () => {
  const theme = useTheme();
  const isSmallerThanSM = useMediaQuery(theme.breakpoints.down("sm"));
  const [tips, setTips] = useState<ITipsAndTricks[]>([]);

  const getBalance = async () => {
    try {
      const res = await ApiService.getAllTips();
      const data = res.data.data;
      data.sort(
        (a: ITipsAndTricks, b: ITipsAndTricks) => a.session - b.session
      );
      setTips(data);
    } catch (error) {}
  };

  useEffect(() => {
    getBalance();
  }, []);
  return (
    <Box
      sx={{
        p: 2,
        pt: isSmallerThanSM ? 6 : 4,
      }}
    >
      <Typography variant="h3">Legions University</Typography>
      <Card
        className="bg-c4"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          p: 4,
          my: 2,
        }}
      >
        <Typography>
          Every week, here at Legions University, you can attend our live Tips &
          Tricks sessions on{" "}
          <a
            className="fc2 td-none"
            href="https://t.me/CryptoLegionsCommunity"
            target="_blank"
          >
            our Telegram video chat
          </a>
          , on Wednesdays at 5pm UTC. During these sessions, we'll be teaching
          you smart strategies to play the game and maximise your ROI. If you
          attend live, you will be able to ask your questions. The replays are
          available on this page. Using all smart strategies together may
          increase your monthly ROI up to 50%! Make sure to follow all Legions
          University sessions and apply all tips & tricks together to hunt
          smartly.
        </Typography>
        <Typography variant="h4" fontWeight={"bold"} sx={{ my: 2 }}>
          Legions University Curriculum
        </Typography>
        <Box sx={{ mb: 2 }}>
          {tips.map((tip, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant={tip.done ? "h5" : "body1"} fontWeight="bold">
                Session {tip.session}: {tip.title}
              </Typography>
              {tip.video && tip.done && <VideoPlayer link={tip.video} />}
              {tip.chapter.map((item, index) => (
                <Box>
                  <Typography
                    variant={tip.done ? "h6" : "body1"}
                    fontWeight={tip.done ? "bold" : "light"}
                  >
                    {tip.done ? `${tip.session}.${index + 1}` : "-"} {item.desc}
                  </Typography>
                  {tip.done && <VideoPlayer link={item.video} />}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        <Typography variant="h4" fontWeight={"bold"} sx={{ my: 2 }}>
          The Basics - Full Game Instructions:
        </Typography>
        <Typography>
          Before you attend the Legions University sessions, please watch the
          video below with the full game instructions and read the entire{" "}
          <a
            href="https://docs.cryptolegions.app/"
            target="_blank"
            className="fc2 td-none"
          >
            whitepaper
          </a>
          . Basics that are covered in the whitepaper or the video below, will
          not be covered. The tips & tricks taught at Legions University are
          only for serious players who have graduated and understand the basics
          of the game.
        </Typography>
        <VideoPlayer link={constants.navlink.tutorialVideoLink} />
      </Card>
    </Box>
  );
};

export default TipsAndTricks;

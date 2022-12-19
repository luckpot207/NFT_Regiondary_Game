import { CardMedia, Skeleton } from "@mui/material";
import React, { useState } from "react";
import { commonState } from "../../reducers/common.reduer";
import { AppSelector } from "../../store";
import VideoNFT from "./VideoNFT";

type Props = {
  jpg: string;
  mp4: string;
};

const AnimationArt: React.FC<Props> = ({ jpg, mp4 }) => {
  const { showAnimation } = AppSelector(commonState);
  const [loaded, setLoaded] = useState(false);

  const handleImageLoaded = () => {
    setLoaded(true);
  };
  return (
    <>
      {showAnimation ? (
        <VideoNFT src={mp4} />
      ) : (
        <>
          <CardMedia
            component="img"
            image={jpg}
            alt="Art Image"
            loading="lazy"
            onLoad={handleImageLoaded}
          />
          {loaded === false && (
            <React.Fragment>
              <Skeleton variant="rectangular" width="100%" height="350px" />
              <Skeleton />
              <Skeleton width="80%" />
              <Skeleton width="60%" />
            </React.Fragment>
          )}
        </>
      )}
    </>
  );
};

export default AnimationArt;

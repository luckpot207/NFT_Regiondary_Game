import React from "react";

type Props = {
  src: string;
};

const VideoNFT: React.FC<Props> = (props) => {
  const { src } = props;
  return (
    <div
      style={{ display: "flex" }}
      dangerouslySetInnerHTML={{
        __html: `
            <video autoPlay playsinline muted loop id="main-trailer" style="width: 100%;">
              <source src=${src} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
        `,
      }}
    />
  );
};

export default VideoNFT;

import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  wrapper: {
    position: "absolute",
    pointerEvent: "none",
    animation: "$growAndShrink 600ms ease-in-out forwards",
  },
  svg: {
    animation: "$spin 600ms linear forwards",
  },
  "@keyframes growAndShrink": {
    "0%": {
      transform: "scale(0)",
    },
    "50%": {
      transform: "scale(1)",
    },
    "100%": {
      transform: "scale(0)",
    },
  },
  "@keyframes spin ": {
    "0%": {
      transform: "scale(0) rotate(0deg)",
    },
    "50%": {
      transform: "scale(1)",
    },
    "100%": {
      transform: "scale(0) rotate(180deg)",
    },
  },
});

const SparkleInstance = ({ color, size, style }) => {
  const classes = useStyles();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 160 160"
      style={style}
      className={classes.svg}
    >
      <path
        fill={color}
        d="M80 0s4.285 41.292 21.496 58.504C118.707 75.715 160 80 160 80s-41.293 4.285-58.504 21.496S80 160 80 160s-4.285-41.293-21.496-58.504C41.292 84.285 0 80 0 80s41.292-4.285 58.504-21.496C75.715 41.292 80 0 80 0z"
      ></path>
    </svg>
  );
};

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const useRandomInterval = (callback, minDelay, maxDelay) => {
  const timeoutId = React.useRef(null);
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    let isEnabled =
      typeof minDelay === "number" && typeof maxDelay === "number";
    if (isEnabled) {
      const handleTick = () => {
        const nextTickAt = random(minDelay, maxDelay);
        timeoutId.current = window.setTimeout(() => {
          savedCallback.current();
          handleTick();
        }, nextTickAt);
      };
      handleTick();
    }
    return () => window.clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay]);
  const cancel = React.useCallback(function () {
    window.clearTimeout(timeoutId.current);
  }, []);
  return cancel;
};

const DEFAULT_COLOR = "hsl(50deg, 100%, 50%)";

const generateSparkle = (color = DEFAULT_COLOR) => {
  return {
    id: String(random(10, 99)),
    createdAt: Date.now(),
    // Bright yellow color:
    color,
    size: random(15, 20),
    style: {
      // Pick a random spot in the available space
      position: "absolute",
      pointerEvent: "none",
      top: random(0, 100) + "%",
      left: random(0, 100) + "%",
      // Float sparkles above sibling content
      zIndex: 2,
    },
  };
};

function Sparkles({ children, minDelay, maxDelay }) {
  const [sparkles, setSparkles] = React.useState([]);
  const classes = useStyles();

  useRandomInterval(
    () => {
      const now = Date.now();

      const sparkle = generateSparkle("white");

      const nextSparkles = sparkles.filter((sparkle) => {
        const delta = now - sparkle.createdAt;
        return delta < 1000;
      });

      nextSparkles.push(sparkle);
      setSparkles(nextSparkles);
    },
    minDelay,
    maxDelay
  );

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {sparkles.map((sparkle) => (
        <SparkleInstance
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
      <div style={{ position: " relative", zIndex: 1, fontWeight: "bold" }}>
        {children}
      </div>
    </div>
  );
}

export default Sparkles;
